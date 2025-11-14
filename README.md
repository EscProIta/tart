# TruffleTracker Pro 🍄

**L'app definitiva per tartufai professionisti**

TruffleTracker Pro è un'applicazione mobile professionale che combina registrazione battute, analisi meteo-ambientale, tracking GPS e sistema predittivo per ottimizzare la raccolta di tartufi.

## 📱 Caratteristiche MVP (v1.0)

### ✅ Funzionalità Implementate

#### 1. **Registrazione Battute**
- Acquisizione automatica data, ora e posizione GPS
- Selezione tipo di tartufo tra 8 varietà complete
- Inserimento quantità raccolta (grammi/kg)
- Valutazione qualità (1-5 stelle)
- Campo note testuali libere
- Salvataggio offline con sync successiva

#### 2. **Database Varietà Tartufi**
Supporta 8 varietà principali con informazioni complete:
- **Tuber magnatum Pico** - Tartufo Bianco Pregiato
- **Tuber melanosporum Vitt.** - Tartufo Nero Pregiato
- **Tuber aestivum Vitt.** - Tartufo Scorzone Estivo
- **Tuber uncinatum Chatin** - Tartufo Uncinato Autunnale
- **Tuber brumale Vitt.** - Tartufo Nero Invernale
- **Tuber borchii Vitt.** - Tartufo Bianchetto/Marzuolo
- **Tuber macrosporum Vitt.** - Tartufo Nero Liscio
- **Tuber mesentericum Vitt.** - Tartufo Nero Ordinario

Ogni varietà include:
- Periodo di raccolta e picco produttivo
- Condizioni climatiche ottimali
- Habitat preferito
- Caratteristiche organolettiche

#### 3. **Tracking GPS**
- Registrazione automatica posizione durante battute
- Visualizzazione tracce su mappa
- Marcatori georeferenziati dei punti di ritrovamento
- Privacy-first: coordinate protette

#### 4. **Sistema Meteo in Tempo Reale**
Integrazione con **OpenWeather API**:
- Temperatura aria (min/max/attuale)
- Umidità relativa percentuale
- Pressione atmosferica
- Precipitazioni (ultime 24h, 7 giorni, 15 giorni, 30 giorni)
- Direzione vento (con nomi tradizionali italiani)
- Intensità vento
- Copertura nuvolosa
- Punto di rugiada
- Temperatura suolo stimata

#### 5. **Fasi Lunari**
- Calcolo automatico fase lunare
- Visualizzazione grafica (emoji luna)
- Percentuale illuminazione
- Luna crescente/calante/nuova/piena
- Correlazione fasi lunari tradizionali

#### 6. **Analisi e Statistiche**
- Totale battute effettuate
- Kg totali raccolti (per varietà, per anno)
- Media raccolta per battuta
- Tasso di successo
- Record personali
- Dashboard riepilogativa

#### 7. **Raccomandazioni Giornaliere**
- Probabilità successo giornaliera (0-100%)
- Analisi condizioni meteo favorevoli/sfavorevoli
- Score predittivo basato su:
  - Temperatura ottimale
  - Umidità ideale
  - Piogge recenti
  - Condizioni vento

## 🛠 Stack Tecnologico

### Frontend
- **React Native** - Framework mobile cross-platform
- **Expo** - Toolchain e SDK
- **TypeScript** - Type safety
- **React Navigation** - Navigazione app (Stack + Bottom Tabs)

### Backend & Storage
- **SQLite** (expo-sqlite) - Database locale
- **AsyncStorage** - Storage persistente chiave-valore
- **Offline-first** - Funziona senza connessione

### Servizi Esterni
- **OpenWeather API** - Dati meteo real-time e storici
- **Expo Location** - GPS e geolocalizzazione
- **React Native Maps** - Visualizzazione mappe

### Librerie Principali
- `@react-navigation/native` - Navigazione
- `@react-navigation/native-stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator
- `expo-location` - Servizi posizione
- `expo-sqlite` - Database locale
- `react-native-maps` - Mappe
- `axios` - HTTP client
- `date-fns` - Gestione date

## 📦 Installazione e Setup

### Prerequisiti
- **Node.js** (v16 o superiore)
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app su smartphone (iOS/Android) per testing

### 1. Clone del Repository
```bash
git clone https://github.com/yourusername/tart.git
cd tart
```

### 2. Installazione Dipendenze
```bash
npm install
```

### 3. Configurazione API OpenWeather

1. Registrati su [OpenWeather](https://openweathermap.org/api)
2. Ottieni una **API Key gratuita**
3. Apri l'app, vai in **Impostazioni**
4. Inserisci la tua API Key nel campo dedicato
5. Salva le impostazioni

### 4. Avvio dell'App

#### Sviluppo con Expo Go
```bash
npm start
# oppure
npx expo start
```

Scansiona il QR code con:
- **iOS**: Camera app
- **Android**: Expo Go app

#### Build per iOS
```bash
npm run ios
```
*(Richiede macOS e Xcode)*

#### Build per Android
```bash
npm run android
```
*(Richiede Android Studio e Android SDK)*

#### Web (preview)
```bash
npm run web
```

## 📂 Struttura del Progetto

```
tart/
├── src/
│   ├── components/          # Componenti riutilizzabili
│   ├── constants/           # Costanti, colori, varietà tartufi
│   │   ├── index.ts        # Configurazioni app
│   │   └── truffles.ts     # Database varietà tartufi
│   ├── navigation/          # Configurazione navigazione
│   │   └── AppNavigator.tsx
│   ├── screens/             # Schermate principali
│   │   ├── HomeScreen.tsx          # Dashboard principale
│   │   ├── HuntsListScreen.tsx     # Lista battute
│   │   ├── HuntDetailScreen.tsx    # Dettaglio battuta
│   │   ├── NewHuntScreen.tsx       # Registrazione nuova battuta
│   │   ├── StatsScreen.tsx         # Statistiche
│   │   ├── MapScreen.tsx           # Visualizzazione mappe
│   │   └── SettingsScreen.tsx      # Impostazioni
│   ├── services/            # Servizi e API
│   │   ├── database.ts     # SQLite database service
│   │   ├── location.ts     # GPS tracking service
│   │   ├── weather.ts      # OpenWeather API service
│   │   ├── moonPhase.ts    # Moon phase calculator
│   │   └── index.ts        # Export services
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
│       └── index.ts
├── App.tsx                  # Entry point principale
├── package.json
├── tsconfig.json
└── app.json                 # Configurazione Expo

```

## 🗺 Navigazione App

### Bottom Tabs (Navigazione Principale)
1. **🏠 Home** - Dashboard con condizioni attuali e score successo
2. **📋 Battute** - Lista cronologica battute registrate
3. **📊 Statistiche** - Analisi e statistiche personalizzate
4. **🗺 Mappa** - Visualizzazione tracce GPS e punti ritrovamento
5. **⚙️ Impostazioni** - Configurazione app e API

### Modal Screens
- **Dettaglio Battuta** - Vista completa battuta con meteo e luna
- **Nuova Battuta** - Form registrazione rapida battuta

## 🔐 Privacy e Sicurezza

- **Coordinate GPS criptate** - Le posizioni delle tartufaie sono protette
- **Storage locale** - Tutti i dati sono salvati solo sul dispositivo
- **No cloud obbligatorio** - Funziona completamente offline
- **Opzionale: sync cloud** - (feature futura)

## 📊 Database Schema

### Tabella: `hunts`
Registrazione battute con:
- ID univoco
- User ID
- Data/ora inizio e fine
- Tipo tartufo
- Quantità raccolta
- Qualità (1-5)
- Note
- Foto (URI)
- Traccia GPS (JSON)
- Punti ritrovamento
- Snapshot meteo completo
- Fase lunare
- Flag successo
- Timestamp creazione/aggiornamento

### Tabella: `settings`
Configurazioni utente:
- API keys
- Unità di misura
- Preferenze notifiche
- Privacy settings

### Tabella: `seasonal_forecasts`
Previsioni stagionali (feature futura):
- Anno e tipo tartufo
- Quality score
- Confidence
- Date stimate

## 🌡 Servizi Implementati

### 1. DatabaseService
Gestione SQLite locale:
- Creazione tabelle
- CRUD battute
- Statistiche aggregate
- Query ottimizzate con indici

### 2. LocationService
Tracking GPS:
- Permessi geolocalizzazione
- Tracking continuo durante battuta
- Calcolo distanze (Haversine)
- Reverse geocoding
- Export GPX/KML (ready)

### 3. WeatherService
Integrazione OpenWeather API:
- Meteo real-time
- Forecast 7 giorni
- Dati storici precipitazioni
- Calcolo dew point
- Stima temperatura suolo
- Analisi condizioni favorevoli

### 4. MoonPhaseService
Calcolo fasi lunari:
- Algoritmo astronomico preciso
- Illuminazione percentuale
- Nomi fasi in italiano
- Calendario lunare mensile/annuale
- Predizione prossime fasi

## 🚀 Roadmap Future Features

### Fase 2 - Sistema Predittivo (3 mesi)
- [ ] Analisi periodo pre-stagionale
- [ ] Calcolo qualità stagione (0-100)
- [ ] Machine Learning personalizzato
- [ ] Raccomandazioni orari ottimali
- [ ] Notifiche push condizioni ideali

### Fase 3 - Advanced Features (3 mesi)
- [ ] Integrazione sensori IoT (umidità suolo)
- [ ] Centralina meteo personale Bluetooth/WiFi
- [ ] Export PDF report stagionali
- [ ] Grafici avanzati (chart.js)
- [ ] Backup cloud opzionale

### Fase 4 - Community (ongoing)
- [ ] Condivisione dati anonimi (opt-in)
- [ ] Pattern meteo-produttività aggregati
- [ ] Forum tartufai
- [ ] Marketplace (opzionale)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 🐛 Troubleshooting

### Errore: "Database not initialized"
Assicurati che l'app abbia completato l'inizializzazione prima di navigare.

### Mappe non visualizzate
1. Verifica permessi di localizzazione
2. Controlla connessione internet
3. iOS: Verifica configurazione Google Maps API

### Meteo non carica
1. Inserisci API Key OpenWeather valida
2. Verifica connessione internet
3. Controlla quota API gratuita (60 chiamate/min)

### GPS non funziona
1. Abilita permessi posizione
2. Attiva GPS sul dispositivo
3. Prova in esterno (segnale migliore)

## 📄 Licenza

Copyright © 2024 TruffleTracker Pro
Tutti i diritti riservati.

## 🤝 Contributi

Questo è un progetto MVP. Per contributi o segnalazioni bug:
1. Fork il repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📧 Contatti

Per supporto o domande: [Inserire email di supporto]

## 🙏 Ringraziamenti

- **OpenWeather** - Dati meteo real-time
- **Expo Team** - Framework mobile eccellente
- **React Native Community** - Librerie e supporto
- **Tartufai Esperti** - Consulenza dominio

---

**TruffleTracker Pro** - *Trasforma l'esperienza in dati, i dati in successo* 🍄✨
