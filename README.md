# 🌊 DRAIN-SHIELD | Flash Flood Early Warning System for Hilly Regions

> **Smart India Hackathon (SIH) Prototype**  
> Problem Statement: Flash Flood Prediction System for Hilly Regions using Multi-Source Data  
> Target Basin: Upper Alaknanda & Rishiganga River Catchment (Uttarakhand Himalayas)

---

## 🚀 Quick Start (Running Locally)

To run the complete prototype on your laptop:

### Terminal 1: Start Backend API (Express.js on Port 5000)
```powershell
cd server
npm.cmd run dev
```
*API will run at:* `http://localhost:5000` (test status at `http://localhost:5000/api/flood/status`)

### Terminal 2: Start Frontend Dashboard (React + Vite on Port 5173)
```powershell
cd client
npm.cmd run dev
```
*Open in Browser:* `http://localhost:5173`

---

## 🎯 Hackathon Presentation Walkthrough (For Judges & Teachers)

Follow this 5-minute flow during your presentation:

1. **Introduction & Motivation (1 min)**:
   - Show the interactive map of the Alaknanda catchment (Govindghat, Joshimath, Pipalkoti, Chamoli, Nandaprayag, Karnaprayag).
   - Explain why hilly regions are vulnerable: steep slope angles (>35°), narrow river gorges, and cloudbursts causing flash floods in under 15 minutes before traditional models react.
   - Highlight the **Multi-Source Data Fusion**:
     - 🌦️ **IMD Weather**: Radar reflectivity (dBZ) & rainfall rates (mm/h).
     - 🏔️ **ISRO Bhuvan Cartosat DEM**: Slope gradient, flow accumulation, elevation.
     - 📡 **IoT Edge (ESP32 + LoRaWAN)**: Ultrasonic water level and soil moisture transmitting over 865 MHz (operates even if cell towers fail).

2. **Demonstrating Normal Operations (1 min)**:
   - Click **"Normal Conditions"** on the top demo bar.
   - Show that all settlements are in **Green (LOW Risk <35%)**.
   - Click on any village marker to show the live ESP32 telemetry (stable water level, normal soil moisture).

3. **Simulating Monsoon & Upstream Cloudburst (1.5 min)**:
   - Click **"Sustained Monsoon"**: Watch rainfall jump to 28 mm/h, risk elevate to **Yellow (MEDIUM)**.
   - Click **"Upstream Cloudburst"**: Rainfall reaches 95 mm/h. Watch the Random Forest ML engine recalculate risks in real-time.
   - Show the **Explainable AI (XAI) Panel**:
     - Walk the judges through the **Feature Importances**: Rainfall (35%), Soil Saturation (25%), Water Rise Rate (22%), DEM Slope (12%), Landslide Index (6%).
     - Show the natural language AI reasoning explanation.

4. **Triggering Critical Emergency & Evacuation (1 min)**:
   - Click **"Catastrophic Deluge"** (or use the custom sliders to push rainfall >100 mm/h and soil saturation >80%).
   - The system triggers a **CRITICAL RED ALERT**:
     - The bottom emergency bar pulses with an audible/visual siren toggle.
     - Targeted low-lying wards (Nandaprayag, Govindghat) flash on the map.
     - Click **"Dispatch CAP Evacuation Alerts"**: Simulates automated SMS cell broadcast, radio dispatch to NDRF 8th Battalion, and route highlighting to safe highland shelters (e.g. Govindghat Higher Secondary Ground at 1950m).

5. **Showcasing Technical Architecture (30 sec)**:
   - Click the top right **"SIH System Architecture"** button.
   - Show judges the clean 4-tier pipeline and explain how the system will integrate with Python Scikit-Learn, GeoPandas, PostGIS, and physical LoRaWAN hardware.

---

## 📂 Project Structure & How to Modify

The project is intentionally structured with simple, modular files and friendly comments:

```
FlashFloodEasy/
│
├── server/                                # Express.js Backend
│   ├── src/
│   │   ├── index.js                       # Server entry point & CORS configuration
│   │   ├── routes/
│   │   │   └── api.js                     # REST routes (/api/flood/status, /simulate, /alerts)
│   │   ├── controllers/
│   │   │   └── floodController.js         # Coordinates ingestion, ML inference, and alerts
│   │   ├── services/
│   │   │   ├── imdWeatherService.js       # IMD rainfall & radar simulation (plug real API here)
│   │   │   ├── isroDemService.js          # ISRO Bhuvan DEM & terrain slope service
│   │   │   ├── iotLoraService.js          # ESP32 LoRaWAN stream simulator (plug MQTT here)
│   │   │   ├── preprocessingPipeline.js   # Horton runoff calculation & feature normalization
│   │   │   └── mockRandomForestEngine.js  # Random Forest ML logic (plug Python .pkl here)
│   │   └── data/
│   │       └── villages.json              # Himalayan settlements, coordinates, shelters
│   └── package.json
│
├── client/                                # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── main.jsx                       # React root
│   │   ├── App.jsx                        # Main dashboard container & state
│   │   ├── index.css                      # Tailwind styling & dark theme definitions
│   │   └── components/
│   │       ├── Navbar.jsx                 # Top branding, LoRa status, and time
│   │       ├── ScenarioBar.jsx            # 1-click test scenarios & custom tuning sliders
│   │       ├── RiskSummaryCards.jsx       # 4 KPI cards (Risk score, IMD rain, Hotspot, IoT mesh)
│   │       ├── HillyCatchmentMap.jsx      # Leaflet interactive map with river & risk nodes
│   │       ├── MLInsightsPanel.jsx        # Random Forest explainability & feature weights
│   │       ├── IoTStreamPanel.jsx         # ESP32 edge stream (water level, rise rate, LoRa RSSI)
│   │       ├── EvacuationAlertModal.jsx   # Critical alert banner, siren sound, CAP SMS broadcast
│   │       └── ArchitectureModal.jsx      # Technical design modal for SIH evaluators
│   ├── index.html
│   ├── vite.config.js                     # Configured with proxy to port 5000
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                              # This guide
```

---

## 🔌 How to Add Real APIs Later

Every service file includes a `// TODO: Replace with real API` comment:

1. **To Connect a Real Python ML Model (Scikit-Learn / XGBoost)**:
   In `server/src/services/mockRandomForestEngine.js`, replace the internal tree evaluation with:
   ```javascript
   const res = await fetch('http://localhost:8000/predict', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(features)
   });
   return await res.json();
   ```

2. **To Connect Real Weather (IMD or Open-Meteo)**:
   In `server/src/services/imdWeatherService.js`, fetch precipitation using:
   ```javascript
   const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=30.55&longitude=79.56&hourly=precipitation`);
   ```

3. **To Connect Real ESP32 Hardware via LoRaWAN**:
   In `server/src/services/iotLoraService.js`, connect an MQTT client to ChirpStack or The Things Network (TTN):
   ```javascript
   import mqtt from 'mqtt';
   const client = mqtt.connect('mqtt://eu1.cloud.thethings.network:1883');
   ```

---

## 🏆 Key Strengths to Highlight in SIH Evaluation
- **Solves the Mountain Delay**: Traditional flood models take hours; this prototype couples upstream slope + soil saturation to predict flash floods before river surges strike downstream settlements.
- **Disaster Resilience**: Uses LoRaWAN (865 MHz) edge computing that continues reporting even when cellular towers or power grids wash away.
- **Action-Oriented**: Does not just show numbers; it automatically triggers Common Alerting Protocol (CAP) SMS broadcasts and maps safe evacuation shelters for every village.
