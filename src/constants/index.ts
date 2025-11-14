// TruffleTracker Pro - App Constants

/**
 * App colors palette
 */
export const Colors = {
  primary: '#6B4423',        // Brown (truffle color)
  secondary: '#8B6F47',      // Light brown
  accent: '#D4AF37',         // Gold
  background: '#F5F5F0',     // Off-white
  surface: '#FFFFFF',
  text: '#2C1810',
  textSecondary: '#6B6B6B',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Truffle type colors
  truffleWhite: '#F5DEB3',
  truffleBlack: '#2C2416',

  // Season colors
  seasonEarly: '#81C784',
  seasonPeak: '#4CAF50',
  seasonLate: '#FFA726',
  seasonOff: '#9E9E9E',

  // Weather conditions
  weatherGood: '#4CAF50',
  weatherModerate: '#FF9800',
  weatherPoor: '#F44336',
};

/**
 * App spacing scale
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Typography
 */
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

/**
 * Border radius
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  round: 999,
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  OPENWEATHER_GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  TIMEOUT: 10000, // 10 seconds
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  USER_ID: '@truffletracker:userId',
  SETTINGS: '@truffletracker:settings',
  API_KEY_OPENWEATHER: '@truffletracker:apiKey:openweather',
  LAST_LOCATION: '@truffletracker:lastLocation',
  HUNTS_CACHE: '@truffletracker:huntsCache',
};

/**
 * Database configuration
 */
export const DB_CONFIG = {
  NAME: 'truffletracker.db',
  VERSION: 1,
};

/**
 * GPS configuration
 */
export const GPS_CONFIG = {
  ACCURACY: 'high' as const,
  DISTANCE_INTERVAL: 10, // meters
  TIME_INTERVAL: 5000,   // 5 seconds
};

/**
 * Map configuration
 */
export const MAP_CONFIG = {
  DEFAULT_DELTA: {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  MARKER_COLORS: {
    find: '#D4AF37',      // Gold for truffle finds
    start: '#4CAF50',     // Green for hunt start
    end: '#F44336',       // Red for hunt end
  },
};

/**
 * Weather update intervals (milliseconds)
 */
export const WEATHER_UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes

/**
 * Quality rating labels
 */
export const QUALITY_LABELS = {
  1: 'Scarsa',
  2: 'Sufficiente',
  3: 'Buona',
  4: 'Ottima',
  5: 'Eccellente',
};

/**
 * Time slot hours for daily recommendations
 */
export const TIME_SLOTS = {
  EARLY_MORNING: { start: 5, end: 8, name: 'Mattino presto' },
  MORNING: { start: 8, end: 12, name: 'Mattina' },
  AFTERNOON: { start: 12, end: 16, name: 'Pomeriggio' },
  LATE_AFTERNOON: { start: 16, end: 19, name: 'Tardo pomeriggio' },
  EVENING: { start: 19, end: 23, name: 'Sera' },
};

/**
 * Default app settings
 */
export const DEFAULT_SETTINGS = {
  units: {
    weight: 'g' as const,
    distance: 'km' as const,
    temperature: 'C' as const,
  },
  notifications: {
    enabled: true,
    optimalConditions: true,
    seasonStart: true,
    peakSeason: true,
    forecastUpdates: false,
    quietHoursStart: 22,
    quietHoursEnd: 7,
  },
  privacy: {
    encryptCoordinates: true,
    shareAnonymousData: false,
  },
};

/**
 * Pagination
 */
export const PAGINATION = {
  HUNTS_PER_PAGE: 20,
  LOAD_MORE_THRESHOLD: 0.5,
};

export * from './truffles';
