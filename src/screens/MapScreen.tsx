// TruffleTracker Pro - Map Screen

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, Spacing, Typography, MAP_CONFIG } from '../constants';
import { locationService, db } from '../services';
import { Coordinate, Hunt } from '../types';

export default function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [hunts, setHunts] = useState<Hunt[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get current location
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }

      // Load hunts with GPS data
      const userId = 'default-user'; // TODO: Get from auth context
      const loadedHunts = await db.getHunts(userId);
      const huntsWithGPS = loadedHunts.filter(h => h.gpsTrack && h.gpsTrack.points.length > 0);
      setHunts(huntsWithGPS);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !currentLocation) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Caricamento mappa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          ...MAP_CONFIG.DEFAULT_DELTA,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="La tua posizione"
          pinColor={MAP_CONFIG.MARKER_COLORS.start}
        />

        {/* Hunt Tracks */}
        {hunts.map(hunt => {
          if (!hunt.gpsTrack) return null;

          return (
            <React.Fragment key={hunt.id}>
              {/* Track Polyline */}
              <Polyline
                coordinates={hunt.gpsTrack.points.map(p => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeColor={Colors.primary}
                strokeWidth={3}
              />

              {/* Finding Points */}
              {hunt.findingPoints?.map((point, index) => (
                <Marker
                  key={`${hunt.id}-${index}`}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  pinColor={MAP_CONFIG.MARKER_COLORS.find}
                  title={`Ritrovamento ${index + 1}`}
                />
              ))}
            </React.Fragment>
          );
        })}
      </MapView>

      {hunts.length === 0 && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayText}>
              Nessuna traccia GPS disponibile.{'\n'}
              Le tue battute appariranno qui.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  overlayCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  overlayText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
