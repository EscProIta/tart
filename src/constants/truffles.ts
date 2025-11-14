// TruffleTracker Pro - Truffle Varieties Database

import { TruffleType, TruffleVariety } from '../types';

/**
 * Complete database of truffle varieties with detailed information
 */
export const TRUFFLE_VARIETIES: Record<TruffleType, TruffleVariety> = {
  [TruffleType.MAGNATUM]: {
    id: TruffleType.MAGNATUM,
    scientificName: 'Tuber magnatum Pico',
    commonName: 'Tartufo Bianco Pregiato',
    seasonStart: { month: 9, day: 15 },  // 15 settembre
    seasonEnd: { month: 1, day: 31 },    // 31 gennaio
    peakStart: { month: 10, day: 15 },   // 15 ottobre
    peakEnd: { month: 12, day: 15 },     // 15 dicembre
    criticalMonths: [5, 6, 7, 8],        // Maggio-Agosto
    optimalConditions: {
      temperature: { min: 10, max: 15 },
      rainfall: { min: 60, max: 100 },   // mm/month durante stagione
      humidity: { min: 70, max: 90 },
    },
    habitat: 'Boschi di latifoglie (pioppo, salice, tiglio, quercia). Terreni argillosi-calcarei ben drenati, zone collinari 200-700m.',
    description: 'Il tartufo più pregiato al mondo. Aroma intenso di aglio e formaggio, sapore unico. Forma irregolare, superficie liscia giallo-ocra, gleba bianco-crema con venature. Richiede piogge estive abbondanti e autunno umido.',
  },

  [TruffleType.MELANOSPORUM]: {
    id: TruffleType.MELANOSPORUM,
    scientificName: 'Tuber melanosporum Vitt.',
    commonName: 'Tartufo Nero Pregiato',
    seasonStart: { month: 11, day: 15 },  // 15 novembre
    seasonEnd: { month: 3, day: 15 },     // 15 marzo
    peakStart: { month: 12, day: 15 },    // 15 dicembre
    peakEnd: { month: 2, day: 28 },       // Fine febbraio
    criticalMonths: [3, 4, 5, 6],         // Marzo-Giugno
    optimalConditions: {
      temperature: { min: 5, max: 12 },
      rainfall: { min: 50, max: 90 },
      humidity: { min: 65, max: 85 },
    },
    habitat: 'Tartufaie naturali o coltivate con quercia, nocciolo, carpino. Terreni calcarei, pH 7.5-8.5, ben drenati, esposizione sud.',
    description: 'Tartufo nero di eccellenza, "diamante nero della cucina". Peridio nero con verruche piramidali, gleba nera con venature bianche. Aroma intenso, persistente. Richiede inverni freddi e primavere piovose.',
  },

  [TruffleType.AESTIVUM]: {
    id: TruffleType.AESTIVUM,
    scientificName: 'Tuber aestivum Vitt.',
    commonName: 'Tartufo Scorzone Estivo',
    seasonStart: { month: 5, day: 1 },    // 1 maggio
    seasonEnd: { month: 9, day: 30 },     // 30 settembre
    peakStart: { month: 6, day: 15 },     // 15 giugno
    peakEnd: { month: 8, day: 31 },       // Fine agosto
    criticalMonths: [3, 4, 5],            // Marzo-Maggio
    optimalConditions: {
      temperature: { min: 15, max: 25 },
      rainfall: { min: 40, max: 80 },
      humidity: { min: 60, max: 80 },
    },
    habitat: 'Boschi misti latifoglie e conifere, quercia, nocciolo, pino. Terreni calcarei, anche sassosi. 300-1000m altitudine.',
    description: 'Tartufo estivo più comune. Peridio nero con grosse verruche piramidali, gleba nocciola chiara con venature bianche. Aroma delicato di sottobosco e nocciola. Resiste bene al caldo estivo.',
  },

  [TruffleType.UNCINATUM]: {
    id: TruffleType.UNCINATUM,
    scientificName: 'Tuber uncinatum Chatin',
    commonName: 'Tartufo Uncinato Autunnale',
    seasonStart: { month: 9, day: 1 },    // 1 settembre
    seasonEnd: { month: 12, day: 31 },    // 31 dicembre
    peakStart: { month: 10, day: 1 },     // 1 ottobre
    peakEnd: { month: 11, day: 30 },      // 30 novembre
    criticalMonths: [5, 6, 7],            // Maggio-Luglio
    optimalConditions: {
      temperature: { min: 8, max: 18 },
      rainfall: { min: 50, max: 90 },
      humidity: { min: 65, max: 85 },
    },
    habitat: 'Simile ad aestivum ma predilige altitudini maggiori (400-1200m). Quercia, faggio, nocciolo. Esposizioni fresche.',
    description: 'Varietà autunnale dello scorzone. Morfologia simile ad aestivum ma gleba più scura (nocciola scuro), aroma più intenso e marcato. Apprezzato in cucina, buon valore commerciale.',
  },

  [TruffleType.BRUMALE]: {
    id: TruffleType.BRUMALE,
    scientificName: 'Tuber brumale Vitt.',
    commonName: 'Tartufo Nero Invernale',
    seasonStart: { month: 11, day: 1 },   // 1 novembre
    seasonEnd: { month: 3, day: 31 },     // 31 marzo
    peakStart: { month: 12, day: 1 },     // 1 dicembre
    peakEnd: { month: 2, day: 15 },       // 15 febbraio
    criticalMonths: [4, 5, 6],            // Aprile-Giugno
    optimalConditions: {
      temperature: { min: 3, max: 10 },
      rainfall: { min: 45, max: 85 },
      humidity: { min: 70, max: 90 },
    },
    habitat: 'Boschi misti, spesso in simbiosi con quercia e nocciolo. Terreni argillosi o sabbiosi, anche in zone umide.',
    description: 'Tartufo invernale diffuso. Peridio nero con piccole verruche, gleba grigio-bruna con venature bianche fitte. Aroma muschiato, meno pregiato del melanosporum. Confondibile ma meno aromatico.',
  },

  [TruffleType.BORCHII]: {
    id: TruffleType.BORCHII,
    scientificName: 'Tuber borchii Vitt.',
    commonName: 'Tartufo Bianchetto / Marzuolo',
    seasonStart: { month: 1, day: 15 },   // 15 gennaio
    seasonEnd: { month: 4, day: 30 },     // 30 aprile
    peakStart: { month: 2, day: 15 },     // 15 febbraio
    peakEnd: { month: 3, day: 31 },       // 31 marzo
    criticalMonths: [11, 12, 1],          // Novembre-Gennaio (anno precedente/corrente)
    optimalConditions: {
      temperature: { min: 5, max: 15 },
      rainfall: { min: 50, max: 100 },
      humidity: { min: 70, max: 90 },
    },
    habitat: 'Pinete litoranee, boschi misti, anche parchi urbani. Terreni sabbiosi o argillosi, pianura e collina 0-800m. Pino, quercia, pioppo.',
    description: 'Tartufo primaverile chiamato "marzuolo". Peridio liscio giallo-ocra, gleba bruno-rossastra con venature bianche. Aroma agliaceo, simile al magnatum ma più penetrante. Diffuso e apprezzato.',
  },

  [TruffleType.MACROSPORUM]: {
    id: TruffleType.MACROSPORUM,
    scientificName: 'Tuber macrosporum Vitt.',
    commonName: 'Tartufo Nero Liscio',
    seasonStart: { month: 9, day: 15 },   // 15 settembre
    seasonEnd: { month: 12, day: 31 },    // 31 dicembre
    peakStart: { month: 10, day: 15 },    // 15 ottobre
    peakEnd: { month: 11, day: 30 },      // 30 novembre
    criticalMonths: [6, 7, 8],            // Giugno-Agosto
    optimalConditions: {
      temperature: { min: 8, max: 16 },
      rainfall: { min: 55, max: 95 },
      humidity: { min: 68, max: 88 },
    },
    habitat: 'Boschi di latifoglie, soprattutto quercia e nocciolo. Terreni argillosi-calcarei, zone umide e ombreggiate, collina 300-900m.',
    description: 'Tartufo autunnale pregiato ma raro. Peridio bruno-rossastro con piccole verruche, gleba bruno-violacea con venature bianche. Aroma intenso di aglio, simile al magnatum. Ricercato dagli intenditori.',
  },

  [TruffleType.MESENTERICUM]: {
    id: TruffleType.MESENTERICUM,
    scientificName: 'Tuber mesentericum Vitt.',
    commonName: 'Tartufo Nero Ordinario',
    seasonStart: { month: 9, day: 1 },    // 1 settembre
    seasonEnd: { month: 1, day: 31 },     // 31 gennaio
    peakStart: { month: 10, day: 1 },     // 1 ottobre
    peakEnd: { month: 12, day: 15 },      // 15 dicembre
    criticalMonths: [5, 6, 7],            // Maggio-Luglio
    optimalConditions: {
      temperature: { min: 8, max: 18 },
      rainfall: { min: 45, max: 85 },
      humidity: { min: 65, max: 85 },
    },
    habitat: 'Boschi di latifoglie, quercia e nocciolo. Terreni vari, anche poveri. Comune in tutta Italia, 0-1000m.',
    description: 'Tartufo comune, meno pregiato. Peridio nero con verruche appiattite, gleba grigio-bruna con venature bianche. Aroma fenolico sgradevole (simile a bitume) che migliora dopo cottura. Uso culinario limitato.',
  },
};

/**
 * Get truffle variety by type
 */
export const getTruffleVariety = (type: TruffleType): TruffleVariety => {
  return TRUFFLE_VARIETIES[type];
};

/**
 * Get all truffle varieties as array
 */
export const getAllTruffleVarieties = (): TruffleVariety[] => {
  return Object.values(TRUFFLE_VARIETIES);
};

/**
 * Get truffle varieties in season for a given date
 */
export const getTrufflesInSeason = (date: Date = new Date()): TruffleVariety[] => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  return getAllTruffleVarieties().filter(truffle => {
    const { seasonStart, seasonEnd } = truffle;

    // Handle season crossing year boundary
    if (seasonStart.month > seasonEnd.month) {
      // Season spans across year (e.g., Sept to Jan)
      return (
        (month > seasonStart.month || (month === seasonStart.month && day >= seasonStart.day)) ||
        (month < seasonEnd.month || (month === seasonEnd.month && day <= seasonEnd.day))
      );
    } else {
      // Season within same year
      return (
        (month > seasonStart.month || (month === seasonStart.month && day >= seasonStart.day)) &&
        (month < seasonEnd.month || (month === seasonEnd.month && day <= seasonEnd.day))
      );
    }
  });
};

/**
 * Check if truffle is in peak season
 */
export const isInPeakSeason = (type: TruffleType, date: Date = new Date()): boolean => {
  const truffle = getTruffleVariety(type);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const { peakStart, peakEnd } = truffle;

  if (peakStart.month > peakEnd.month) {
    // Peak spans year boundary
    return (
      (month > peakStart.month || (month === peakStart.month && day >= peakStart.day)) ||
      (month < peakEnd.month || (month === peakEnd.month && day <= peakEnd.day))
    );
  } else {
    return (
      (month > peakStart.month || (month === peakStart.month && day >= peakStart.day)) &&
      (month < peakEnd.month || (month === peakEnd.month && day <= peakEnd.day))
    );
  }
};

/**
 * Get season status for a truffle type
 */
export const getSeasonStatus = (
  type: TruffleType,
  date: Date = new Date()
): 'off-season' | 'early-season' | 'peak-season' | 'late-season' => {
  const truffle = getTruffleVariety(type);
  const inSeason = getTrufflesInSeason(date).some(t => t.id === type);

  if (!inSeason) return 'off-season';

  if (isInPeakSeason(type, date)) return 'peak-season';

  const month = date.getMonth() + 1;
  const { seasonStart, peakStart } = truffle;

  // Check if we're before peak (early season)
  if (seasonStart.month <= peakStart.month) {
    if (month >= seasonStart.month && month < peakStart.month) {
      return 'early-season';
    }
  } else {
    // Handle year crossing
    if (month >= seasonStart.month || month < peakStart.month) {
      return 'early-season';
    }
  }

  return 'late-season';
};
