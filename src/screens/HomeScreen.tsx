// TruffleTracker Pro - Home Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../constants';
import { weatherService, moonPhaseService, locationService } from '../services';
import { WeatherData, MoonPhase } from '../types';
import { formatTemperature, formatPercentage, formatDateTime } from '../utils';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [successScore, setSuccessScore] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get current location
      const location = await locationService.getCurrentLocation();
      if (!location) {
        console.warn('Could not get location');
        setLoading(false);
        return;
      }

      // Load weather data (requires API key to be set)
      // For MVP, we'll show placeholder if no API key
      const weatherData = await weatherService.getWeatherData(
        location.latitude,
        location.longitude
      );

      if (weatherData) {
        setWeather(weatherData);

        // Calculate success score
        const conditions = weatherService.checkFavorableConditions(weatherData);
        setSuccessScore(conditions.score);
      }

      // Calculate moon phase
      const moon = moonPhaseService.calculateMoonPhase();
      setMoonPhase(moon);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const startNewHunt = () => {
    navigation.navigate('NewHunt' as never);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Caricamento dati...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Success Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Probabilità di Successo Oggi</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{successScore}%</Text>
        </View>
        <Text style={styles.scoreDescription}>
          {successScore >= 75
            ? 'Ottime condizioni!'
            : successScore >= 50
            ? 'Condizioni favorevoli'
            : 'Condizioni non ottimali'}
        </Text>
      </View>

      {/* Weather Card */}
      {weather && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Condizioni Meteo</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Temperatura</Text>
              <Text style={styles.weatherValue}>
                {formatTemperature(weather.current.temperature)}
              </Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Umidità</Text>
              <Text style={styles.weatherValue}>
                {formatPercentage(weather.current.humidity)}
              </Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Vento</Text>
              <Text style={styles.weatherValue}>
                {weather.current.windSpeed.toFixed(0)} km/h
              </Text>
              <Text style={styles.weatherSubtext}>{weather.current.windDirectionName}</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Piogge 24h</Text>
              <Text style={styles.weatherValue}>
                {weather.precipitation.last24h.toFixed(1)} mm
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Moon Phase Card */}
      {moonPhase && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fase Lunare</Text>
          <View style={styles.moonContainer}>
            <Text style={styles.moonEmoji}>
              {moonPhaseService.getMoonEmoji(moonPhase.phaseName)}
            </Text>
            <View style={styles.moonInfo}>
              <Text style={styles.moonPhase}>
                {moonPhaseService.getPhaseNameItalian(moonPhase.phaseName)}
              </Text>
              <Text style={styles.moonDetails}>
                Illuminazione: {formatPercentage(moonPhase.illumination)}
              </Text>
              <Text style={styles.moonDetails}>
                {moonPhase.isWaxing ? 'Crescente' : 'Calante'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton} onPress={startNewHunt}>
        <Text style={styles.actionButtonText}>Inizia Nuova Battuta</Text>
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          💡 Suggerimento: Le migliori condizioni si verificano dopo piogge moderate con
          temperature fresche e alta umidità.
        </Text>
      </View>

      {weather && (
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>
            Ultimo aggiornamento: {formatDateTime(weather.timestamp)}
          </Text>
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
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scoreValue: {
    fontSize: Typography.sizes.xxl + 8,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  scoreDescription: {
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
    fontSize: Typography.sizes.xl,
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
  actionButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  infoCard: {
    backgroundColor: Colors.info + '20',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  timestampContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  timestamp: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
