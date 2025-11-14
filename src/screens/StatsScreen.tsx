// TruffleTracker Pro - Statistics Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants';
import { db } from '../services';
import { UserStats } from '../types';
import { formatWeight, formatPercentage, formatDistance } from '../utils';

export default function StatsScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const userId = 'default-user'; // TODO: Get from auth context
      const userStats = await db.getUserStats(userId);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!stats || stats.totalHunts === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyTitle}>Nessuna statistica disponibile</Text>
        <Text style={styles.emptyText}>
          Registra alcune battute per vedere le tue statistiche
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Riepilogo Generale</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Totale Battute</Text>
          <Text style={styles.statValue}>{stats.totalHunts}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Totale Raccolto</Text>
          <Text style={styles.statValue}>{formatWeight(stats.totalQuantity, 'kg')}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Media per Battuta</Text>
          <Text style={styles.statValue}>{formatWeight(stats.averagePerHunt)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tasso di Successo</Text>
          <Text style={styles.statValue}>{formatPercentage(stats.successRate)}</Text>
        </View>
      </View>

      {/* Records Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Record Personali</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Miglior Battuta</Text>
          <Text style={styles.statValue}>
            {formatWeight(stats.personalRecords.maxSingleHunt)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Distanza Massima</Text>
          <Text style={styles.statValue}>
            {formatDistance(stats.personalRecords.longestDistance)}
          </Text>
        </View>
      </View>

      {/* By Truffle Type */}
      {Object.keys(stats.byTruffleType).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Per Tipo di Tartufo</Text>
          {Object.entries(stats.byTruffleType).map(([type, data]) => (
            <View key={type} style={styles.truffleTypeRow}>
              <View style={styles.truffleTypeHeader}>
                <Text style={styles.truffleTypeName}>{type}</Text>
                <Text style={styles.truffleTypeQuantity}>
                  {formatWeight(data.quantity, 'kg')}
                </Text>
              </View>
              <Text style={styles.truffleTypeDetails}>
                {data.count} battute • Qualità media: {data.averageQuality.toFixed(1)}⭐
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  truffleTypeRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  truffleTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  truffleTypeName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  truffleTypeQuantity: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  truffleTypeDetails: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
