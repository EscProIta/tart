// TruffleTracker Pro - TypeScript Type Definitions

/**
 * Truffle variety types
 */
export enum TruffleType {
  MAGNATUM = 'magnatum',           // Bianco pregiato
  MELANOSPORUM = 'melanosporum',   // Nero pregiato
  AESTIVUM = 'aestivum',           // Scorzone estivo
  UNCINATUM = 'uncinatum',         // Uncinato autunnale
  BRUMALE = 'brumale',             // Nero invernale
  BORCHII = 'borchii',             // Bianchetto/Marzuolo
  MACROSPORUM = 'macrosporum',     // Nero liscio
  MESENTERICUM = 'mesentericum',   // Nero ordinario
}

/**
 * Truffle variety detailed information
 */
export interface TruffleVariety {
  id: TruffleType;
  scientificName: string;
  commonName: string;
  seasonStart: { month: number; day: number };
  seasonEnd: { month: number; day: number };
  peakStart: { month: number; day: number };
  peakEnd: { month: number; day: number };
  criticalMonths: number[]; // Pre-seasonal critical months
  optimalConditions: {
    temperature: { min: number; max: number }; // °C
    rainfall: { min: number; max: number };    // mm/month
    humidity: { min: number; max: number };    // %
  };
  habitat: string;
  description: string;
}

/**
 * GPS Coordinate
 */
export interface Coordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

/**
 * GPS Track for a hunt
 */
export interface GPSTrack {
  points: Coordinate[];
  totalDistance: number; // meters
  averageSpeed: number;  // km/h
  duration: number;      // seconds
}

/**
 * Hunt (Battuta) record
 */
export interface Hunt {
  id: string;
  userId: string;
  startTime: number;          // Unix timestamp
  endTime?: number;           // Unix timestamp
  truffleType: TruffleType;
  quantity: number;           // grams
  quality: number;            // 1-5 stars
  notes?: string;
  photos?: string[];          // URIs
  gpsTrack?: GPSTrack;
  findingPoints?: Coordinate[]; // Specific finding locations
  weatherSnapshot: WeatherData;
  moonPhase: MoonPhase;
  success: boolean;           // Found truffles or not
  synced: boolean;            // Synced to cloud
  createdAt: number;
  updatedAt: number;
}

/**
 * Weather data snapshot
 */
export interface WeatherData {
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  current: {
    temperature: number;        // °C
    humidity: number;           // %
    pressure: number;           // hPa
    windSpeed: number;          // km/h
    windDirection: number;      // degrees
    windDirectionName?: string; // Tramontana, Grecale, etc.
    cloudCover: number;         // %
    uvIndex: number;
    dewPoint: number;           // °C
    visibility: number;         // km
  };
  soilTemperature?: number;     // °C (estimated or from sensor)
  precipitation: {
    last24h: number;            // mm
    last7days: number;          // mm
    last15days: number;         // mm
    last30days: number;         // mm
  };
  forecast?: {
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  };
}

/**
 * Hourly weather forecast
 */
export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  cloudCover: number;
}

/**
 * Daily weather forecast
 */
export interface DailyForecast {
  date: number;
  temperatureMin: number;
  temperatureMax: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  description: string;
}

/**
 * Moon phase information
 */
export interface MoonPhase {
  phase: number;              // 0-1 (0/1 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter)
  illumination: number;       // 0-100%
  phaseName: MoonPhaseName;
  isWaxing: boolean;
  timestamp: number;
}

export enum MoonPhaseName {
  NEW = 'new',
  WAXING_CRESCENT = 'waxing_crescent',
  FIRST_QUARTER = 'first_quarter',
  WAXING_GIBBOUS = 'waxing_gibbous',
  FULL = 'full',
  WANING_GIBBOUS = 'waning_gibbous',
  LAST_QUARTER = 'last_quarter',
  WANING_CRESCENT = 'waning_crescent',
}

/**
 * User statistics
 */
export interface UserStats {
  totalHunts: number;
  totalQuantity: number;        // grams
  totalDistance: number;        // km
  totalDuration: number;        // hours
  successRate: number;          // %
  averagePerHunt: number;       // grams
  byTruffleType: {
    [key in TruffleType]?: {
      count: number;
      quantity: number;
      averageQuality: number;
    };
  };
  bestHunt?: Hunt;
  personalRecords: {
    maxSingleHunt: number;      // grams
    longestDistance: number;    // km
    longestDuration: number;    // hours
  };
}

/**
 * Daily recommendation
 */
export interface DailyRecommendation {
  date: number;
  overallScore: number;         // 0-100%
  truffleType: TruffleType;
  bestTimeSlots: TimeSlot[];
  weatherConditions: {
    favorable: string[];
    unfavorable: string[];
  };
  confidence: number;           // 0-100%
  reasoning: string;
}

/**
 * Time slot recommendation
 */
export interface TimeSlot {
  startHour: number;            // 0-23
  endHour: number;
  score: number;                // 0-100%
  ranking: number;              // 1, 2, 3
  reasons: string[];
}

/**
 * Seasonal forecast
 */
export interface SeasonalForecast {
  id: string;
  year: number;
  truffleType: TruffleType;
  qualityScore: number;         // 0-100
  confidence: number;           // 0-100%
  estimatedStart: number;       // Unix timestamp
  estimatedPeak: number;        // Unix timestamp
  estimatedEnd: number;         // Unix timestamp
  yieldVsAverage: number;       // % (-50% to +200%)
  contributingFactors: {
    rainfall: number;           // weighted score
    temperature: number;
    drought: number;
    soilMoisture: number;
  };
  criticalPeriodAnalysis: {
    monthlyData: MonthlyWeatherSummary[];
    meetsOptimal: boolean;
  };
  comparison: {
    vs5YearAverage: number;     // %
    vsBestYear: number;         // %
    vsWorstYear: number;        // %
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * Monthly weather summary for critical period analysis
 */
export interface MonthlyWeatherSummary {
  month: number;
  year: number;
  totalRainfall: number;        // mm
  avgTemperature: number;       // °C
  maxConsecutiveDryDays: number;
  avgHumidity: number;          // %
  meetsOptimal: boolean;
}

/**
 * App settings
 */
export interface AppSettings {
  userId: string;
  units: {
    weight: 'g' | 'kg';
    distance: 'km' | 'mi';
    temperature: 'C' | 'F';
  };
  location: {
    defaultLatitude?: number;
    defaultLongitude?: number;
    defaultName?: string;
  };
  notifications: {
    enabled: boolean;
    optimalConditions: boolean;
    seasonStart: boolean;
    peakSeason: boolean;
    forecastUpdates: boolean;
    quietHoursStart?: number;   // hour 0-23
    quietHoursEnd?: number;
  };
  privacy: {
    encryptCoordinates: boolean;
    shareAnonymousData: boolean;
  };
  weatherStation?: {
    enabled: boolean;
    type: 'bluetooth' | 'wifi';
    deviceId?: string;
    protocol?: 'davis' | 'ecowitt' | 'netatmo';
  };
  apiKeys: {
    openWeather?: string;
  };
}

/**
 * Wind direction names (Italian traditional)
 */
export const WIND_DIRECTIONS: { [key: number]: string } = {
  0: 'Tramontana',      // North
  45: 'Grecale',        // Northeast
  90: 'Levante',        // East
  135: 'Scirocco',      // Southeast
  180: 'Ostro',         // South
  225: 'Libeccio',      // Southwest
  270: 'Ponente',       // West
  315: 'Maestrale',     // Northwest
};
