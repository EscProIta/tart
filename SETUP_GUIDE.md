# 🚀 Guida Setup TruffleTracker Pro

## Configurazione Iniziale

### 1️⃣ Ottieni API Key OpenWeather (GRATIS)

**Perché serve?**
L'app usa OpenWeather API per ottenere dati meteo in tempo reale (temperatura, umidità, piogge, vento, ecc.)

**Come ottenerla:**

1. Vai su: **https://openweathermap.org/api**
2. Click su **"Sign Up"** (in alto a destra)
3. Crea account gratuito:
   - Email
   - Username
   - Password
4. Conferma email
5. Login e vai su: **https://home.openweathermap.org/api_keys**
6. Copia la tua **API Key** (stringa tipo: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

**Piano Gratuito include:**
- ✅ 60 chiamate/minuto
- ✅ 1,000,000 chiamate/mese
- ✅ Dati meteo attuali
- ✅ Forecast 5 giorni
- ✅ Più che sufficiente per uso personale!

---

### 2️⃣ Configura l'App

1. **Apri TruffleTracker Pro**
2. Vai al tab **⚙️ Impostazioni** (ultimo tab in basso)
3. Nella sezione **"Configurazione API"**:
   - Trova il campo **"OpenWeather API Key"**
   - Incolla la tua API Key
4. **Tap "Salva Impostazioni"**

**✅ Fatto!** Ora l'app può recuperare dati meteo.

---

### 3️⃣ Permessi da Concedere

Al primo avvio, l'app chiederà:

#### **📍 Permessi Posizione (GPS)**
- **Quando:** Apri la Home o inizi una battuta
- **Perché:** Per tracciare percorsi e salvare coordinate ritrovamenti
- **Scegli:** "Consenti mentre usi l'app" (iOS) o "Consenti" (Android)

⚠️ **Importante:** Senza permessi GPS, non potrai:
- Vedere la tua posizione
- Tracciare battute
- Salvare punti ritrovamento
- Usare la mappa

---

## 🎯 Primo Utilizzo

### Test Rapido delle Funzionalità

#### **1. Home Screen - Condizioni Attuali**
- Vedrai il **Score di Successo** giornaliero (0-100%)
- Card **Meteo** con temperatura, umidità, vento, piogge
- Card **Fase Lunare** con emoji e info
- Suggerimento in basso

**Se il meteo non appare:**
- Verifica API Key inserita correttamente
- Controlla connessione internet
- Riavvia l'app (swipe up/close)

#### **2. Registra Prima Battuta**
1. Tap pulsante **"Inizia Nuova Battuta"**
2. Compila il form:
   - **Tipo tartufo:** Scegli dalla lista (es. "Tartufo Bianco Pregiato")
   - **Quantità:** Inserisci grammi (es. 150)
   - **Qualità:** Tap sulle stelle (1-5)
   - **Note:** Opzionale (es. "Zona quercia vicino fiume")
3. Tap **"Salva Battuta"**

**Cosa succede:**
- L'app salva automaticamente:
  - ✅ Data e ora corrente
  - ✅ Tua posizione GPS
  - ✅ Snapshot meteo completo
  - ✅ Fase lunare corrente

#### **3. Visualizza Battute**
1. Vai al tab **📋 Battute**
2. Vedrai la lista delle tue battute
3. Tap su una per vedere **dettagli completi**:
   - Info battuta
   - Condizioni meteo del momento
   - Fase lunare
   - Note
   - Pulsante elimina

#### **4. Statistiche**
1. Vai al tab **📊 Statistiche**
2. Vedrai:
   - Totale battute
   - Kg raccolti
   - Media per battuta
   - Tasso di successo
   - Record personali
   - Breakdown per tipo tartufo

**Nota:** Con 1 sola battuta, le stats saranno basiche. Registra più battute per vedere analisi complete!

#### **5. Mappa**
1. Vai al tab **🗺 Mappa**
2. Vedrai:
   - Tua posizione corrente (pin verde)
   - Tracce GPS battute passate (linee marroni)
   - Punti ritrovamento (pin dorati)

**Se la mappa è vuota:**
- È normale se non hai ancora battute con tracce GPS
- La funzione tracking sarà aggiunta in versione futura

---

## 🧪 Test Completo Funzionalità

### **Scenario: Registra Battuta Completa**

1. **Prepara:**
   - Attiva GPS sul telefono
   - Verifica connessione internet
   - Apri TruffleTracker Pro

2. **Home:**
   - Controlla score successo
   - Leggi condizioni meteo
   - Nota fase lunare

3. **Nuova Battuta:**
   - Tap "Inizia Nuova Battuta"
   - Tipo: "Tartufo Nero Pregiato"
   - Quantità: 250g
   - Qualità: 4 stelle
   - Note: "Bosco di querce, terreno umido dopo pioggia"
   - Salva

4. **Verifica:**
   - Vai in "Battute"
   - Apri dettaglio
   - Controlla tutti i dati salvati

5. **Statistiche:**
   - Vai in "Statistiche"
   - Verifica totali aggiornati

6. **Ripeti:**
   - Registra 3-4 battute diverse
   - Varia tipo tartufo, quantità, qualità
   - Osserva come cambiano le stats

---

## 🔧 Impostazioni Avanzate

### **Notifiche**
- **Abilita/Disabilita:** Switch ON/OFF
- In futuro riceverai alert quando condizioni sono ottimali

### **Privacy**
- **Crittografa coordinate GPS:** Raccomandato ON
- Protegge le posizioni delle tue tartufaie

### **Unità di Misura**
Attualmente fisse su:
- Peso: Grammi (g) / Kilogrammi (kg)
- Distanza: Chilometri (km)
- Temperatura: Celsius (°C)

---

## ❓ FAQ

### **Q: Posso usare l'app offline?**
**A:** Sì! Puoi registrare battute anche senza internet. I dati meteo verranno salvati come "non disponibili" ma tutto il resto funziona. Quando torni online, aggiorna la home per vedere meteo corrente.

### **Q: I miei dati sono al sicuro?**
**A:** Sì. Tutti i dati sono salvati **solo sul tuo telefono** in un database locale SQLite. Non vengono inviati a nessun server esterno.

### **Q: Posso esportare i dati?**
**A:** Feature in arrivo! In futuro potrai esportare in CSV, PDF, GPX.

### **Q: Quante battute posso registrare?**
**A:** Illimitate! L'unico limite è lo spazio sul tuo telefono (ma ogni battuta occupa pochi KB).

### **Q: Posso modificare una battuta già salvata?**
**A:** Attualmente no, ma puoi eliminarla e crearne una nuova. Feature "modifica" in roadmap.

### **Q: L'app funziona senza internet?**
**A:** Sì, per la maggior parte:
- ✅ Registra battute
- ✅ Visualizza battute salvate
- ✅ Statistiche
- ✅ Mappa (con dati già scaricati)
- ❌ Meteo real-time (richiede internet)
- ❌ Mappe nuove zone (richiede internet)

### **Q: Come resetto tutto e ricomincio?**
**A:** Disinstalla e reinstalla l'app. Tutti i dati verranno eliminati.

---

## 🐛 Problemi Comuni

### **Meteo non si carica**
1. Verifica API Key inserita
2. Controlla internet
3. Vai in Impostazioni → reinserisci API Key → Salva
4. Torna alla Home → Pull-to-refresh (swipe down)

### **GPS non funziona**
1. Attiva GPS nelle impostazioni telefono
2. Vai in Impostazioni telefono → TruffleTracker → Permessi → Posizione: "Sempre" o "Mentre usi app"
3. Prova all'aperto (segnale migliore)

### **App crashata/non si apre**
1. Chiudi completamente l'app
2. Riapri
3. Se persiste: disinstalla e reinstalla

### **Score successo sempre a 50%**
- Normale se non hai API Key configurata
- Configura OpenWeather API Key per score reale

---

## 📞 Supporto

Hai problemi? Controlla:
1. Questa guida
2. README.md principale
3. Sezione Troubleshooting

---

## 🎉 Sei Pronto!

Ora puoi iniziare a usare **TruffleTracker Pro** per tracciare le tue battute e ottimizzare la ricerca di tartufi!

**Buona caccia!** 🍄✨
