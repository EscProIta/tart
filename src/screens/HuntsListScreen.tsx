// TruffleTracker Pro - Hunts List Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../constants';
import { db } from '../services';
import { Hunt } from '../types';
import { formatDateTime, formatWeight, formatDuration } from '../utils';
import { getTruffleVariety } from '../constants/truffles';

export default function HuntsListScreen() {
  const navigation = useNavigation();
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadHunts();
    }, [])
  );

  const loadHunts = async () => {
    try {
      setLoading(true);
      const userId = 'default-user'; // TODO: Get from auth context
      const loadedHunts = await db.getHunts(userId);
      setHunts(loadedHunts);
    } catch (error) {
      console.error('Error loading hunts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHunts();
    setRefreshing(false);
  };

  const openHuntDetail = (huntId: string) => {
    navigation.navigate('HuntDetail' as never, { huntId } as never);
  };

  const renderHuntItem = ({ item }: { item: Hunt }) => {
    const truffle = getTruffleVariety(item.truffleType);
    const duration = item.endTime ? item.endTime - item.startTime : 0;

    return (
      <TouchableOpacity
        style={styles.huntCard}
        onPress={() => openHuntDetail(item.id)}
      >
        <View style={styles.huntHeader}>
          <Text style={styles.truffleName}>{truffle.commonName}</Text>
          <Text style={styles.quantity}>{formatWeight(item.quantity)}</Text>
        </View>

        <View style={styles.huntDetails}>
          <Text style={styles.date}>{formatDateTime(item.startTime)}</Text>
          {item.endTime && (
            <Text style={styles.duration}>
              Durata: {formatDuration(duration / 1000)}
            </Text>
          )}
        </View>

        <View style={styles.huntFooter}>
          <View style={styles.qualityStars}>
            {[1, 2, 3, 4, 5].map(star => (
              <Text key={star} style={styles.star}>
                {star <= item.quality ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
          {item.notes && (
            <Text style={styles.noteIndicator}>📝 Note</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🍄</Text>
      <Text style={styles.emptyTitle}>Nessuna battuta registrata</Text>
      <Text style={styles.emptyText}>
        Inizia a tracciare le tue battute per vedere statistiche e analisi
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hunts}
        renderItem={renderHuntItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
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
  },
  listContent: {
    padding: Spacing.md,
  },
  huntCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  huntHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  truffleName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
  },
  quantity: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  huntDetails: {
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  duration: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  huntFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityStars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  noteIndicator: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
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
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
