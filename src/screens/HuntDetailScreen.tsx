// TruffleTracker Pro - Hunt Detail Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../constants';
import { db, moonPhaseService } from '../services';
import { Hunt } from '../types';
import {
  formatDateTime,
  formatWeight,
  formatTemperature,
  formatPercentage,
  formatDuration,
} from '../utils';
import { getTruffleVariety } from '../constants/truffles';

export default function HuntDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { huntId } = route.params as { huntId: string };

  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHunt();
  }, [huntId]);

  const loadHunt = async () => {
    try {
      setLoading(true);
      const loadedHunt = await db.getHunt(huntId);
      setHunt(loadedHunt);
    } catch (error) {
      console.error('Error loading hunt:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHunt = () => {
    Alert.alert(
      'Elimina Battuta',
      'Sei sicuro di voler eliminare questa battuta?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteHunt(huntId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Errore', 'Impossibile eliminare la battuta');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!hunt) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Battuta non trovata</Text>
      </View>
    );
  }

  const truffle = getTruffleVariety(hunt.truffleType);
  const duration = hunt.endTime ? (hunt.endTime - hunt.startTime) / 1000 : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.truffleName}>{truffle.commonName}</Text>
        <Text style={styles.scientificName}>{truffle.scientificName}</Text>
      </View>

      {/* Main Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantità</Text>
          <Text style={styles.infoValue}>{formatWeight(hunt.quantity)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Qualità</Text>
          <View style={styles.qualityStars}>
            {[1, 2, 3, 4, 5].map(star => (
              <Text key={star} style={styles.star}>
                {star <= hunt.quality ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data e Ora</Text>
          <Text style={styles.infoValue}>{formatDateTime(hunt.startTime)}</Text>
        </View>

        {hunt.endTime && duration > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Durata</Text>
            <Text style={styles.infoValue}>{formatDuration(duration)}</Text>
          </View>
        )}
      </View>

      {/* Notes */}
      {hunt.notes && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Note</Text>
          <Text style={styles.notesText}>{hunt.notes}</Text>
        </View>
      )}

      {/* Weather Data */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Condizioni Meteo</Text>

        <View style={styles.weatherGrid}>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Temperatura</Text>
            <Text style={styles.weatherValue}>
              {formatTemperature(hunt.weatherSnapshot.current.temperature)}
            </Text>
          </View>

          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Umidità</Text>
            <Text style={styles.weatherValue}>
              {formatPercentage(hunt.weatherSnapshot.current.humidity)}
            </Text>
          </View>

          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Pressione</Text>
            <Text style={styles.weatherValue}>
              {hunt.weatherSnapshot.current.pressure} hPa
            </Text>
          </View>

          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Vento</Text>
            <Text style={styles.weatherValue}>
              {hunt.weatherSnapshot.current.windSpeed.toFixed(0)} km/h
            </Text>
            <Text style={styles.weatherSubtext}>
              {hunt.weatherSnapshot.current.windDirectionName}
            </Text>
          </View>

          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Piogge 24h</Text>
            <Text style={styles.weatherValue}>
              {hunt.weatherSnapshot.precipitation.last24h.toFixed(1)} mm
            </Text>
          </View>
        </View>
      </View>

      {/* Moon Phase */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fase Lunare</Text>
        <View style={styles.moonContainer}>
          <Text style={styles.moonEmoji}>
            {moonPhaseService.getMoonEmoji(hunt.moonPhase.phaseName)}
          </Text>
          <View style={styles.moonInfo}>
            <Text style={styles.moonPhase}>
              {moonPhaseService.getPhaseNameItalian(hunt.moonPhase.phaseName)}
            </Text>
            <Text style={styles.moonDetails}>
              Illuminazione: {formatPercentage(hunt.moonPhase.illumination)}
            </Text>
            <Text style={styles.moonDetails}>
              {hunt.moonPhase.isWaxing ? 'Crescente' : 'Calante'}
            </Text>
          </View>
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={deleteHunt}>
        <Text style={styles.deleteButtonText}>Elimina Battuta</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.xl }} />
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
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  truffleName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  scientificName: {
    fontSize: Typography.sizes.md,
    color: Colors.surface,
    fontStyle: 'italic',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  qualityStars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 18,
    marginLeft: 2,
  },
  notesText: {
    fontSize: Typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weatherItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  weatherLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  weatherValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  weatherSubtext: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  moonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonEmoji: {
    fontSize: 64,
    marginRight: Spacing.lg,
  },
  moonInfo: {
    flex: 1,
  },
  moonPhase: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  moonDetails: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
});
