// TruffleTracker Pro - Location Service

import * as Location from 'expo-location';
import { Coordinate, GPSTrack } from '../types';
import { GPS_CONFIG } from '../constants';

class LocationService {
  private watchSubscription: Location.LocationSubscription | null = null;
  private trackingPoints: Coordinate[] = [];
  private isTracking = false;
  private startTime: number = 0;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Coordinate | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Start GPS tracking for a hunt
   */
  async startTracking(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      if (this.isTracking) {
        console.warn('Already tracking');
        return false;
      }

      // Reset tracking data
      this.trackingPoints = [];
      this.startTime = Date.now();
      this.isTracking = true;

      // Get initial position
      const initialLocation = await this.getCurrentLocation();
      if (initialLocation) {
        this.trackingPoints.push(initialLocation);
      }

      // Start watching position
      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: GPS_CONFIG.DISTANCE_INTERVAL,
          timeInterval: GPS_CONFIG.TIME_INTERVAL,
        },
        (location) => {
          const point: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || undefined,
            accuracy: location.coords.accuracy || undefined,
            timestamp: location.timestamp,
          };

          this.trackingPoints.push(point);
        }
      );

      console.log('GPS tracking started');
      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      this.isTracking = false;
      return false;
    }
  }

  /**
   * Stop GPS tracking and return track data
   */
  async stopTracking(): Promise<GPSTrack | null> {
    try {
      if (!this.isTracking) {
        console.warn('Not currently tracking');
        return null;
      }

      // Stop watching position
      if (this.watchSubscription) {
        this.watchSubscription.remove();
        this.watchSubscription = null;
      }

      this.isTracking = false;

      // Calculate track statistics
      const totalDistance = this.calculateTotalDistance(this.trackingPoints);
      const duration = (Date.now() - this.startTime) / 1000; // seconds
      const averageSpeed = duration > 0 ? (totalDistance / 1000) / (duration / 3600) : 0; // km/h

      const track: GPSTrack = {
        points: [...this.trackingPoints],
        totalDistance,
        averageSpeed,
        duration,
      };

      // Clean up
      this.trackingPoints = [];
      this.startTime = 0;

      console.log('GPS tracking stopped', {
        points: track.points.length,
        distance: `${(totalDistance / 1000).toFixed(2)} km`,
        duration: `${(duration / 60).toFixed(0)} min`,
      });

      return track;
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
      return null;
    }
  }

  /**
   * Get current tracking points (while tracking)
   */
  getCurrentTrack(): Coordinate[] {
    return [...this.trackingPoints];
  }

  /**
   * Check if currently tracking
   */
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Calculate total distance from array of coordinates (Haversine formula)
   */
  private calculateTotalDistance(points: Coordinate[]): number {
    if (points.length < 2) return 0;

    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const distance = this.calculateDistance(points[i], points[i + 1]);
      totalDistance += distance;
    }

    return totalDistance; // meters
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in meters
   */
  calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
    const R = 6371000; // Earth radius in meters
    const lat1 = this.toRadians(coord1.latitude);
    const lat2 = this.toRadians(coord2.latitude);
    const deltaLat = this.toRadians(coord2.latitude - coord1.latitude);
    const deltaLon = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const parts = [
          address.city || address.subregion,
          address.region,
          address.country,
        ].filter(Boolean);

        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Format coordinates as string
   */
  formatCoordinates(coord: Coordinate, precision: number = 6): string {
    const lat = coord.latitude.toFixed(precision);
    const lon = coord.longitude.toFixed(precision);
    return `${lat}, ${lon}`;
  }

  /**
   * Calculate center point of multiple coordinates
   */
  calculateCenter(coordinates: Coordinate[]): Coordinate | null {
    if (coordinates.length === 0) return null;

    const sum = coordinates.reduce(
      (acc, coord) => ({
        latitude: acc.latitude + coord.latitude,
        longitude: acc.longitude + coord.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: sum.latitude / coordinates.length,
      longitude: sum.longitude / coordinates.length,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate bounding box for coordinates
   */
  calculateBoundingBox(coordinates: Coordinate[]): {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  } | null {
    if (coordinates.length === 0) return null;

    const lats = coordinates.map(c => c.latitude);
    const lons = coordinates.map(c => c.longitude);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
    };
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
