// TruffleTracker Pro - Moon Phase Service

import { MoonPhase, MoonPhaseName } from '../types';

class MoonPhaseService {
  /**
   * Calculate moon phase for a given date
   * Algorithm based on astronomical calculations
   */
  calculateMoonPhase(date: Date = new Date()): MoonPhase {
    const phase = this.calculatePhaseValue(date);
    const illumination = this.calculateIllumination(phase);
    const phaseName = this.getPhaseName(phase);
    const isWaxing = this.isWaxing(phase);

    return {
      phase,
      illumination,
      phaseName,
      isWaxing,
      timestamp: date.getTime(),
    };
  }

  /**
   * Calculate moon phase value (0-1)
   * 0/1 = New Moon
   * 0.25 = First Quarter
   * 0.5 = Full Moon
   * 0.75 = Last Quarter
   */
  private calculatePhaseValue(date: Date): number {
    // Known new moon: January 6, 2000, 18:14 UTC
    const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
    const synodicMonth = 29.530588853; // days

    const currentTime = date.getTime();
    const daysSinceKnownNewMoon = (currentTime - knownNewMoon) / (1000 * 60 * 60 * 24);

    // Calculate phase (0-1)
    const phase = (daysSinceKnownNewMoon % synodicMonth) / synodicMonth;

    return phase;
  }

  /**
   * Calculate illumination percentage
   */
  private calculateIllumination(phase: number): number {
    // Illumination follows a cosine curve
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
    return Math.round(illumination * 100);
  }

  /**
   * Determine if moon is waxing (growing) or waning (shrinking)
   */
  private isWaxing(phase: number): boolean {
    return phase < 0.5;
  }

  /**
   * Get phase name from phase value
   */
  private getPhaseName(phase: number): MoonPhaseName {
    if (phase < 0.03 || phase > 0.97) {
      return MoonPhaseName.NEW;
    } else if (phase >= 0.03 && phase < 0.22) {
      return MoonPhaseName.WAXING_CRESCENT;
    } else if (phase >= 0.22 && phase < 0.28) {
      return MoonPhaseName.FIRST_QUARTER;
    } else if (phase >= 0.28 && phase < 0.47) {
      return MoonPhaseName.WAXING_GIBBOUS;
    } else if (phase >= 0.47 && phase < 0.53) {
      return MoonPhaseName.FULL;
    } else if (phase >= 0.53 && phase < 0.72) {
      return MoonPhaseName.WANING_GIBBOUS;
    } else if (phase >= 0.72 && phase < 0.78) {
      return MoonPhaseName.LAST_QUARTER;
    } else {
      return MoonPhaseName.WANING_CRESCENT;
    }
  }

  /**
   * Get phase name in Italian
   */
  getPhaseNameItalian(phaseName: MoonPhaseName): string {
    const names: Record<MoonPhaseName, string> = {
      [MoonPhaseName.NEW]: 'Luna Nuova',
      [MoonPhaseName.WAXING_CRESCENT]: 'Luna Crescente',
      [MoonPhaseName.FIRST_QUARTER]: 'Primo Quarto',
      [MoonPhaseName.WAXING_GIBBOUS]: 'Gibbosa Crescente',
      [MoonPhaseName.FULL]: 'Luna Piena',
      [MoonPhaseName.WANING_GIBBOUS]: 'Gibbosa Calante',
      [MoonPhaseName.LAST_QUARTER]: 'Ultimo Quarto',
      [MoonPhaseName.WANING_CRESCENT]: 'Luna Calante',
    };

    return names[phaseName];
  }

  /**
   * Get moon emoji for phase
   */
  getMoonEmoji(phaseName: MoonPhaseName): string {
    const emojis: Record<MoonPhaseName, string> = {
      [MoonPhaseName.NEW]: '🌑',
      [MoonPhaseName.WAXING_CRESCENT]: '🌒',
      [MoonPhaseName.FIRST_QUARTER]: '🌓',
      [MoonPhaseName.WAXING_GIBBOUS]: '🌔',
      [MoonPhaseName.FULL]: '🌕',
      [MoonPhaseName.WANING_GIBBOUS]: '🌖',
      [MoonPhaseName.LAST_QUARTER]: '🌗',
      [MoonPhaseName.WANING_CRESCENT]: '🌘',
    };

    return emojis[phaseName];
  }

  /**
   * Calculate moon phases for a month
   */
  getMonthlyMoonPhases(year: number, month: number): MoonPhase[] {
    const phases: MoonPhase[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      phases.push(this.calculateMoonPhase(date));
    }

    return phases;
  }

  /**
   * Get next phase occurrence
   */
  getNextPhase(targetPhase: MoonPhaseName, fromDate: Date = new Date()): Date {
    const currentPhase = this.calculateMoonPhase(fromDate);
    const synodicMonth = 29.530588853; // days

    // Approximate days to target phase
    const targetPhaseValues: Record<MoonPhaseName, number> = {
      [MoonPhaseName.NEW]: 0,
      [MoonPhaseName.WAXING_CRESCENT]: 0.125,
      [MoonPhaseName.FIRST_QUARTER]: 0.25,
      [MoonPhaseName.WAXING_GIBBOUS]: 0.375,
      [MoonPhaseName.FULL]: 0.5,
      [MoonPhaseName.WANING_GIBBOUS]: 0.625,
      [MoonPhaseName.LAST_QUARTER]: 0.75,
      [MoonPhaseName.WANING_CRESCENT]: 0.875,
    };

    const targetValue = targetPhaseValues[targetPhase];
    let daysDiff = (targetValue - currentPhase.phase) * synodicMonth;

    if (daysDiff < 0) {
      daysDiff += synodicMonth;
    }

    const nextDate = new Date(fromDate.getTime() + daysDiff * 24 * 60 * 60 * 1000);
    return nextDate;
  }

  /**
   * Check if moon phase is favorable for truffle hunting (traditional belief)
   * Some hunters believe waning moon is better
   */
  isFavorablePhase(phase: MoonPhase): boolean {
    // Traditional belief: waning moon (after full moon) is better
    return !phase.isWaxing && phase.phaseName !== MoonPhaseName.NEW;
  }

  /**
   * Get phase description
   */
  getPhaseDescription(phase: MoonPhase): string {
    const name = this.getPhaseNameItalian(phase.phaseName);
    const emoji = this.getMoonEmoji(phase.phaseName);
    const illumination = `${phase.illumination}%`;
    const trend = phase.isWaxing ? 'crescente' : 'calante';

    return `${emoji} ${name} (${illumination} ${trend})`;
  }

  /**
   * Calculate moon rise and set times (simplified)
   * Note: This is a simplified calculation. For accurate times, use a dedicated astronomy library
   */
  getMoonTimes(
    date: Date,
    latitude: number,
    longitude: number
  ): { rise: Date | null; set: Date | null } {
    // This is a very simplified estimation
    // For production, consider using a library like suncalc or a dedicated API

    const phase = this.calculateMoonPhase(date);

    // Approximate: full moon rises at sunset, new moon rises at sunrise
    const baseHour = 6 + (phase.phase * 24);

    const rise = new Date(date);
    rise.setHours(Math.floor(baseHour), 0, 0, 0);

    const set = new Date(date);
    set.setHours(Math.floor((baseHour + 12) % 24), 0, 0, 0);

    return { rise, set };
  }

  /**
   * Get lunar calendar for a year
   */
  getYearlyLunarCalendar(year: number): {
    newMoons: Date[];
    fullMoons: Date[];
    firstQuarters: Date[];
    lastQuarters: Date[];
  } {
    const calendar = {
      newMoons: [] as Date[],
      fullMoons: [] as Date[],
      firstQuarters: [] as Date[],
      lastQuarters: [] as Date[],
    };

    let currentDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    while (currentDate <= endDate) {
      const phase = this.calculateMoonPhase(currentDate);

      if (phase.phaseName === MoonPhaseName.NEW && phase.phase < 0.01) {
        calendar.newMoons.push(new Date(currentDate));
      } else if (phase.phaseName === MoonPhaseName.FULL && Math.abs(phase.phase - 0.5) < 0.01) {
        calendar.fullMoons.push(new Date(currentDate));
      } else if (phase.phaseName === MoonPhaseName.FIRST_QUARTER && Math.abs(phase.phase - 0.25) < 0.01) {
        calendar.firstQuarters.push(new Date(currentDate));
      } else if (phase.phaseName === MoonPhaseName.LAST_QUARTER && Math.abs(phase.phase - 0.75) < 0.01) {
        calendar.lastQuarters.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }
}

// Export singleton instance
export const moonPhaseService = new MoonPhaseService();
export default moonPhaseService;
