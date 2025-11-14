// TruffleTracker Pro - New Hunt Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Colors, Spacing, Typography } from '../constants';
import { getAllTruffleVarieties } from '../constants/truffles';
import { TruffleType, Hunt } from '../types';
import { db, locationService, weatherService, moonPhaseService } from '../services';
import { generateId } from '../utils';

export default function NewHuntScreen() {
  const navigation = useNavigation();
  const truffleVarieties = getAllTruffleVarieties();

  const [truffleType, setTruffleType] = useState<TruffleType>(TruffleType.MAGNATUM);
  const [quantity, setQuantity] = useState('');
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const saveHunt = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Errore', 'Inserisci una quantità valida');
      return;
    }

    try {
      setSaving(true);

      // Get current location
      const location = await locationService.getCurrentLocation();
      if (!location) {
        Alert.alert('Errore', 'Impossibile ottenere la posizione');
        setSaving(false);
        return;
      }

      // Get weather data
      const weather = await weatherService.getWeatherData(
        location.latitude,
        location.longitude
      );

      if (!weather) {
        Alert.alert('Errore', 'Impossibile ottenere i dati meteo');
        setSaving(false);
        return;
      }

      // Calculate moon phase
      const moonPhase = moonPhaseService.calculateMoonPhase();

      // Create hunt object
      const hunt: Hunt = {
        id: generateId(),
        userId: 'default-user', // TODO: Get from auth context
        startTime: Date.now(),
        endTime: Date.now(), // Same as start for simple entry
        truffleType,
        quantity: parseFloat(quantity),
        quality,
        notes: notes || undefined,
        weatherSnapshot: weather,
        moonPhase,
        success: true,
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to database
      await db.saveHunt(hunt);

      Alert.alert('Successo', 'Battuta salvata correttamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error saving hunt:', error);
      Alert.alert('Errore', 'Impossibile salvare la battuta');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Truffle Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo di Tartufo *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={truffleType}
              onValueChange={setTruffleType}
              style={styles.picker}
            >
              {truffleVarieties.map(variety => (
                <Picker.Item
                  key={variety.id}
                  label={variety.commonName}
                  value={variety.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.field}>
          <Text style={styles.label}>Quantità (grammi) *</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Es. 150"
            keyboardType="numeric"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Quality */}
        <View style={styles.field}>
          <Text style={styles.label}>Qualità</Text>
          <View style={styles.qualityContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setQuality(star)}
                style={styles.starButton}
              >
                <Text style={styles.starText}>
                  {star <= quality ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Note (opzionale)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Aggiungi note sulla battuta..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ I dati meteo e la fase lunare verranno salvati automaticamente
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveHunt}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Salvataggio...' : 'Salva Battuta'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Annulla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    padding: Spacing.md,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  qualityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  starButton: {
    padding: Spacing.sm,
  },
  starText: {
    fontSize: 32,
  },
  infoBox: {
    backgroundColor: Colors.info + '20',
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    marginBottom: Spacing.lg,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
});
