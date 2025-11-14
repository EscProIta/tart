// TruffleTracker Pro - Main App Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';

// Import screens (will be created)
import HomeScreen from '../screens/HomeScreen';
import HuntsListScreen from '../screens/HuntsListScreen';
import HuntDetailScreen from '../screens/HuntDetailScreen';
import NewHuntScreen from '../screens/NewHuntScreen';
import StatsScreen from '../screens/StatsScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  HuntDetail: { huntId: string };
  NewHunt: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Hunts: undefined;
  Stats: undefined;
  Map: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tabs Navigator
 */
function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'TruffleTracker Pro',
        }}
      />
      <Tab.Screen
        name="Hunts"
        component={HuntsListScreen}
        options={{
          title: 'Battute',
          headerTitle: 'Le Mie Battute',
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Statistiche',
          headerTitle: 'Statistiche',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Mappa',
          headerTitle: 'Mappa Tartufaie',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Impostazioni',
          headerTitle: 'Impostazioni',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HuntDetail"
          component={HuntDetailScreen}
          options={{
            title: 'Dettagli Battuta',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="NewHunt"
          component={NewHuntScreen}
          options={{
            title: 'Nuova Battuta',
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
