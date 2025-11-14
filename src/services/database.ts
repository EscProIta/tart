// TruffleTracker Pro - Database Service (SQLite)

import * as SQLite from 'expo-sqlite';
import { Hunt, UserStats, SeasonalForecast, AppSettings } from '../types';
import { DB_CONFIG } from '../constants';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_CONFIG.NAME);

      // Create tables
      await this.createTables();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * Create all necessary tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Hunts table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS hunts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        truffle_type TEXT NOT NULL,
        quantity REAL NOT NULL,
        quality INTEGER NOT NULL,
        notes TEXT,
        photos TEXT,
        gps_track TEXT,
        finding_points TEXT,
        weather_snapshot TEXT NOT NULL,
        moon_phase TEXT NOT NULL,
        success INTEGER NOT NULL,
        synced INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Create indexes for better query performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_hunts_user_id ON hunts(user_id);
      CREATE INDEX IF NOT EXISTS idx_hunts_start_time ON hunts(start_time);
      CREATE INDEX IF NOT EXISTS idx_hunts_truffle_type ON hunts(truffle_type);
    `);

    // Settings table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        user_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Seasonal forecasts table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS seasonal_forecasts (
        id TEXT PRIMARY KEY,
        year INTEGER NOT NULL,
        truffle_type TEXT NOT NULL,
        quality_score REAL NOT NULL,
        confidence REAL NOT NULL,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Weather cache table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS weather_cache (
        id TEXT PRIMARY KEY,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON weather_cache(timestamp);
    `);
  }

  /**
   * Save a hunt record
   */
  async saveHunt(hunt: Hunt): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO hunts (
          id, user_id, start_time, end_time, truffle_type, quantity, quality,
          notes, photos, gps_track, finding_points, weather_snapshot, moon_phase,
          success, synced, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hunt.id,
          hunt.userId,
          hunt.startTime,
          hunt.endTime || null,
          hunt.truffleType,
          hunt.quantity,
          hunt.quality,
          hunt.notes || null,
          hunt.photos ? JSON.stringify(hunt.photos) : null,
          hunt.gpsTrack ? JSON.stringify(hunt.gpsTrack) : null,
          hunt.findingPoints ? JSON.stringify(hunt.findingPoints) : null,
          JSON.stringify(hunt.weatherSnapshot),
          JSON.stringify(hunt.moonPhase),
          hunt.success ? 1 : 0,
          hunt.synced ? 1 : 0,
          hunt.createdAt,
          hunt.updatedAt,
        ]
      );
    } catch (error) {
      console.error('Error saving hunt:', error);
      throw error;
    }
  }

  /**
   * Get all hunts for a user
   */
  async getHunts(userId: string, limit?: number, offset?: number): Promise<Hunt[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const query = limit
        ? `SELECT * FROM hunts WHERE user_id = ? ORDER BY start_time DESC LIMIT ? OFFSET ?`
        : `SELECT * FROM hunts WHERE user_id = ? ORDER BY start_time DESC`;

      const params = limit ? [userId, limit, offset || 0] : [userId];

      const result = await this.db.getAllAsync<any>(query, params);

      return result.map(this.rowToHunt);
    } catch (error) {
      console.error('Error getting hunts:', error);
      throw error;
    }
  }

  /**
   * Get a single hunt by ID
   */
  async getHunt(id: string): Promise<Hunt | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getFirstAsync<any>(
        'SELECT * FROM hunts WHERE id = ?',
        [id]
      );

      return result ? this.rowToHunt(result) : null;
    } catch (error) {
      console.error('Error getting hunt:', error);
      throw error;
    }
  }

  /**
   * Delete a hunt
   */
  async deleteHunt(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('DELETE FROM hunts WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting hunt:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Get overall stats
      const overall = await this.db.getFirstAsync<any>(
        `SELECT
          COUNT(*) as total_hunts,
          SUM(quantity) as total_quantity,
          SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_hunts
        FROM hunts
        WHERE user_id = ?`,
        [userId]
      );

      // Get stats by truffle type
      const byType = await this.db.getAllAsync<any>(
        `SELECT
          truffle_type,
          COUNT(*) as count,
          SUM(quantity) as quantity,
          AVG(quality) as avg_quality
        FROM hunts
        WHERE user_id = ?
        GROUP BY truffle_type`,
        [userId]
      );

      // Get best hunt
      const bestHuntRow = await this.db.getFirstAsync<any>(
        `SELECT * FROM hunts WHERE user_id = ? ORDER BY quantity DESC LIMIT 1`,
        [userId]
      );

      const totalHunts = overall?.total_hunts || 0;
      const totalQuantity = overall?.total_quantity || 0;
      const successfulHunts = overall?.successful_hunts || 0;

      const stats: UserStats = {
        totalHunts,
        totalQuantity,
        totalDistance: 0, // TODO: Calculate from GPS tracks
        totalDuration: 0, // TODO: Calculate from hunt durations
        successRate: totalHunts > 0 ? (successfulHunts / totalHunts) * 100 : 0,
        averagePerHunt: totalHunts > 0 ? totalQuantity / totalHunts : 0,
        byTruffleType: {},
        bestHunt: bestHuntRow ? this.rowToHunt(bestHuntRow) : undefined,
        personalRecords: {
          maxSingleHunt: bestHuntRow?.quantity || 0,
          longestDistance: 0, // TODO
          longestDuration: 0, // TODO
        },
      };

      // Populate by truffle type
      byType.forEach(row => {
        stats.byTruffleType[row.truffle_type] = {
          count: row.count,
          quantity: row.quantity,
          averageQuality: row.avg_quality,
        };
      });

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(userId: string, settings: AppSettings): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO settings (user_id, data, updated_at) VALUES (?, ?, ?)',
        [userId, JSON.stringify(settings), Date.now()]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Get app settings
   */
  async getSettings(userId: string): Promise<AppSettings | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getFirstAsync<any>(
        'SELECT data FROM settings WHERE user_id = ?',
        [userId]
      );

      return result ? JSON.parse(result.data) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  /**
   * Save seasonal forecast
   */
  async saveSeasonalForecast(forecast: SeasonalForecast): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO seasonal_forecasts (
          id, year, truffle_type, quality_score, confidence, data, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          forecast.id,
          forecast.year,
          forecast.truffleType,
          forecast.qualityScore,
          forecast.confidence,
          JSON.stringify(forecast),
          forecast.createdAt,
          forecast.updatedAt,
        ]
      );
    } catch (error) {
      console.error('Error saving seasonal forecast:', error);
      throw error;
    }
  }

  /**
   * Get seasonal forecast
   */
  async getSeasonalForecast(
    year: number,
    truffleType: string
  ): Promise<SeasonalForecast | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getFirstAsync<any>(
        'SELECT data FROM seasonal_forecasts WHERE year = ? AND truffle_type = ?',
        [year, truffleType]
      );

      return result ? JSON.parse(result.data) : null;
    } catch (error) {
      console.error('Error getting seasonal forecast:', error);
      throw error;
    }
  }

  /**
   * Convert database row to Hunt object
   */
  private rowToHunt(row: any): Hunt {
    return {
      id: row.id,
      userId: row.user_id,
      startTime: row.start_time,
      endTime: row.end_time,
      truffleType: row.truffle_type,
      quantity: row.quantity,
      quality: row.quality,
      notes: row.notes,
      photos: row.photos ? JSON.parse(row.photos) : undefined,
      gpsTrack: row.gps_track ? JSON.parse(row.gps_track) : undefined,
      findingPoints: row.finding_points ? JSON.parse(row.finding_points) : undefined,
      weatherSnapshot: JSON.parse(row.weather_snapshot),
      moonPhase: JSON.parse(row.moon_phase),
      success: row.success === 1,
      synced: row.synced === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync('DELETE FROM hunts');
      await this.db.execAsync('DELETE FROM settings');
      await this.db.execAsync('DELETE FROM seasonal_forecasts');
      await this.db.execAsync('DELETE FROM weather_cache');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();
export default db;
