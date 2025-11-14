// TruffleTracker Pro - Settings Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography } from '../constants';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [encryptCoords, setEncryptCoords] = useState(true);

  const saveSettings = () => {
    Alert.alert('Successo', 'Impostazioni salvate correttamente');
    // TODO: Save to database
  };

  return (
    <ScrollView style={styles.container}>
      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurazione API</Text>

        <Text style={styles.label}>OpenWeather API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Inserisci la tua API key"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
        />
        <Text style={styles.hint}>
          Ottieni una chiave API gratuita su openweathermap.org
        </Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifiche</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Abilita notifiche</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        <Text style={styles.hint}>
          Ricevi notifiche quando le condizioni sono ottimali
        </Text>
      </View>

      {/* Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Crittografa coordinate GPS</Text>
          <Switch
            value={encryptCoords}
            onValueChange={setEncryptCoords}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        <Text style={styles.hint}>
          Proteggi la posizione delle tue tartufaie
        </Text>
      </View>

      {/* Units */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unità di Misura</Text>
        <Text style={styles.settingLabel}>Peso: Grammi (g)</Text>
        <Text style={styles.settingLabel}>Distanza: Chilometri (km)</Text>
        <Text style={styles.settingLabel}>Temperatura: Celsius (°C)</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Salva Impostazioni</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.infoSection}>
        <Text style={styles.appName}>TruffleTracker Pro</Text>
        <Text style={styles.version}>Versione 1.0.0 (MVP)</Text>
        <Text style={styles.copyright}>© 2024 TruffleTracker</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  settingLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  version: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  copyright: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
