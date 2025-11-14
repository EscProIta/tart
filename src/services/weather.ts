// TruffleTracker Pro - Weather Service (OpenWeather API)

import axios from 'axios';
import { WeatherData, HourlyForecast, DailyForecast, WIND_DIRECTIONS } from '../types';
import { API_CONFIG } from '../constants';

class WeatherService {
  private apiKey: string = '';

  /**
   * Set OpenWeather API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Get current weather data with forecast
   */
  async getWeatherData(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    if (!this.apiKey) {
      console.warn('OpenWeather API key not set');
      return null;
    }

    try {
      // Fetch current weather and forecast in parallel
      const [currentResponse, forecastResponse, precipResponse] = await Promise.all([
        this.fetchCurrentWeather(latitude, longitude),
        this.fetchForecast(latitude, longitude),
        this.fetchPrecipitationData(latitude, longitude),
      ]);

      if (!currentResponse) return null;

      const weatherData: WeatherData = {
        timestamp: Date.now(),
        location: {
          latitude,
          longitude,
          name: currentResponse.name || undefined,
        },
        current: {
          temperature: currentResponse.main.temp,
          humidity: currentResponse.main.humidity,
          pressure: currentResponse.main.pressure,
          windSpeed: currentResponse.wind.speed * 3.6, // m/s to km/h
          windDirection: currentResponse.wind.deg,
          windDirectionName: this.getWindDirectionName(currentResponse.wind.deg),
          cloudCover: currentResponse.clouds.all,
          uvIndex: 0, // Not available in current weather endpoint
          dewPoint: this.calculateDewPoint(
            currentResponse.main.temp,
            currentResponse.main.humidity
          ),
          visibility: (currentResponse.visibility || 10000) / 1000, // meters to km
        },
        soilTemperature: this.estimateSoilTemperature(currentResponse.main.temp),
        precipitation: precipResponse || {
          last24h: 0,
          last7days: 0,
          last15days: 0,
          last30days: 0,
        },
        forecast: forecastResponse || undefined,
      };

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Fetch current weather from OpenWeather API
   */
  private async fetchCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<any | null> {
    try {
      const response = await axios.get(`${API_CONFIG.OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          lang: 'it',
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  /**
   * Fetch weather forecast
   */
  private async fetchForecast(
    latitude: number,
    longitude: number
  ): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] } | null> {
    try {
      const response = await axios.get(`${API_CONFIG.OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          lang: 'it',
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      const hourly: HourlyForecast[] = response.data.list.slice(0, 24).map((item: any) => ({
        timestamp: item.dt * 1000,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        precipitation: item.rain?.['3h'] || 0,
        windSpeed: item.wind.speed * 3.6,
        cloudCover: item.clouds.all,
      }));

      // Group by day for daily forecast
      const dailyMap = new Map<string, any[]>();
      response.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, []);
        }
        dailyMap.get(date)!.push(item);
      });

      const daily: DailyForecast[] = Array.from(dailyMap.entries())
        .slice(0, 7)
        .map(([date, items]) => {
          const temps = items.map((i: any) => i.main.temp);
          const precipitation = items.reduce((sum: number, i: any) => sum + (i.rain?.['3h'] || 0), 0);

          return {
            date: new Date(date).getTime(),
            temperatureMin: Math.min(...temps),
            temperatureMax: Math.max(...temps),
            humidity: items.reduce((sum: number, i: any) => sum + i.main.humidity, 0) / items.length,
            precipitation,
            windSpeed: items.reduce((sum: number, i: any) => sum + i.wind.speed, 0) / items.length * 3.6,
            description: items[0].weather[0].description,
          };
        });

      return { hourly, daily };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return null;
    }
  }

  /**
   * Fetch historical precipitation data
   * Note: OpenWeather requires a paid plan for historical data
   * This is a placeholder - implement with actual historical API or use alternative source
   */
  private async fetchPrecipitationData(
    latitude: number,
    longitude: number
  ): Promise<{
    last24h: number;
    last7days: number;
    last15days: number;
    last30days: number;
  } | null> {
    // TODO: Implement historical precipitation data
    // For now, return estimated values based on forecast
    try {
      const forecast = await this.fetchForecast(latitude, longitude);
      if (!forecast) return null;

      const last24h = forecast.hourly.slice(0, 8).reduce((sum, h) => sum + h.precipitation, 0);

      return {
        last24h,
        last7days: last24h * 3, // Rough estimate
        last15days: last24h * 5,
        last30days: last24h * 8,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get wind direction name from degrees
   */
  private getWindDirectionName(degrees: number): string {
    const directions = Object.keys(WIND_DIRECTIONS)
      .map(Number)
      .sort((a, b) => a - b);

    // Normalize degrees to 0-360
    const normalized = ((degrees % 360) + 360) % 360;

    // Find closest direction
    let closest = directions[0];
    let minDiff = Math.abs(normalized - closest);

    for (const dir of directions) {
      const diff = Math.min(
        Math.abs(normalized - dir),
        Math.abs(normalized - (dir + 360)),
        Math.abs(normalized - (dir - 360))
      );

      if (diff < minDiff) {
        minDiff = diff;
        closest = dir;
      }
    }

    return WIND_DIRECTIONS[closest];
  }

  /**
   * Calculate dew point temperature
   * Formula: Magnus-Tetens approximation
   */
  private calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;

    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);

    return Math.round(dewPoint * 10) / 10;
  }

  /**
   * Estimate soil temperature based on air temperature
   * Soil temperature is typically more stable and lags air temperature
   * This is a simplified estimation
   */
  private estimateSoilTemperature(airTemp: number): number {
    // Soil temp is typically 2-4°C higher in summer, 2-4°C lower in winter
    // For simplicity, we estimate it as slightly warmer/cooler based on air temp
    const month = new Date().getMonth() + 1;

    let offset = 0;
    if (month >= 6 && month <= 8) {
      // Summer: soil retains heat
      offset = 2;
    } else if (month >= 12 || month <= 2) {
      // Winter: soil cooler
      offset = -2;
    } else {
      // Spring/Fall: minimal difference
      offset = 0;
    }

    return Math.round((airTemp + offset) * 10) / 10;
  }

  /**
   * Check if conditions are favorable for truffle hunting
   */
  checkFavorableConditions(weather: WeatherData): {
    score: number;
    favorable: string[];
    unfavorable: string[];
  } {
    const favorable: string[] = [];
    const unfavorable: string[] = [];
    let score = 50; // Base score

    // Temperature check (optimal 8-18°C)
    if (weather.current.temperature >= 8 && weather.current.temperature <= 18) {
      favorable.push('Temperatura ideale');
      score += 15;
    } else if (weather.current.temperature < 8) {
      unfavorable.push('Temperatura troppo bassa');
      score -= 10;
    } else if (weather.current.temperature > 22) {
      unfavorable.push('Temperatura troppo alta');
      score -= 15;
    }

    // Humidity check (optimal 70-90%)
    if (weather.current.humidity >= 70 && weather.current.humidity <= 90) {
      favorable.push('Umidità ottimale');
      score += 15;
    } else if (weather.current.humidity < 60) {
      unfavorable.push('Aria troppo secca');
      score -= 15;
    } else if (weather.current.humidity > 95) {
      unfavorable.push('Umidità eccessiva');
      score -= 5;
    }

    // Recent precipitation check
    if (weather.precipitation.last24h > 5 && weather.precipitation.last24h < 30) {
      favorable.push('Piogge recenti favorevoli');
      score += 10;
    } else if (weather.precipitation.last24h > 50) {
      unfavorable.push('Terreno troppo bagnato');
      score -= 10;
    } else if (weather.precipitation.last7days < 10) {
      unfavorable.push('Troppo secco ultimamente');
      score -= 15;
    }

    // Wind check
    if (weather.current.windSpeed < 15) {
      favorable.push('Vento moderato');
      score += 5;
    } else if (weather.current.windSpeed > 30) {
      unfavorable.push('Vento forte');
      score -= 10;
    }

    // Cloud cover
    if (weather.current.cloudCover > 50) {
      favorable.push('Cielo nuvoloso (mantiene umidità)');
      score += 5;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      favorable,
      unfavorable,
    };
  }

  /**
   * Get location name from coordinates
   */
  async getLocationName(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await axios.get(`${API_CONFIG.OPENWEATHER_GEO_URL}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          limit: 1,
          appid: this.apiKey,
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return `${location.name}, ${location.country}`;
      }

      return null;
    } catch (error) {
      console.error('Error fetching location name:', error);
      return null;
    }
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default weatherService;
