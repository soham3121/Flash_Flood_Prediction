# 🌊 DRAIN-SHIELD | Flash Flood Early Warning System for Hilly Regions

> 🔗 **Live Deployment:** [https://drain-shield.vercel.app](https://drain-shield.vercel.app)  
> **Autonomous Flash Flood Prediction & Early Warning System**  
> Focus: Multi-Source Data Fusion (Radar Weather, Satellite DEM, IoT Edge Telemetry)  
> Target Basin: Upper Alaknanda & Rishiganga River Catchment (Uttarakhand Himalayas)

---

## 🚀 Quick Start (Running Locally)

To run the complete system locally:

### Terminal 1: Start Backend API (Express.js on Port 5000)
```powershell
cd server
npm.cmd run dev
```
*API will run at:* `http://localhost:5000` (health check at `http://localhost:5000/api/flood/status`)

### Terminal 2: Start Frontend Dashboard (React + Vite on Port 5173)
```powershell
cd client
npm.cmd run dev
```
*Open in Browser:* `http://localhost:5173`

---

## 🎯 System Demonstration & Operational Flow

Follow this operational flow to explore system capabilities:

1. **Catchment & Regional Monitoring**:
   - Inspect the interactive map of the Alaknanda catchment (Govindghat, Joshimath, Pipalkoti, Chamoli, Nandaprayag, Karnaprayag).
   - Dynamic monitoring of vulnerable mountain hydrology: steep slope angles (>35°), narrow river gorges, and rapid cloudburst runoff.
   - **Multi-Source Data Fusion**:
     - 🌦️ **IMD Weather**: Radar reflectivity (dBZ) & rainfall rates (mm/h).
     - 🏔️ **ISRO Bhuvan Cartosat DEM**: Slope gradient, flow accumulation, elevation.
     - 📡 **IoT Edge (ESP32 + LoRaWAN)**: Ultrasonic water level and soil moisture transmitting over 865 MHz (operates even if cellular networks fail).

2. **Normal Baseline Operations**:
   - Select **"Normal Conditions"** on the incident simulation bar.
   - All settlements report in **Green (LOW Risk <35%)**.
   - Click any village marker to view live ESP32 telemetry (stable water level, normal soil moisture).

3. **Simulating Monsoon & Upstream Cloudburst**:
   - Select **"Sustained Monsoon"**: Rainfall increases to 28 mm/h, risk elevates to **Yellow (MEDIUM)**.
   - Select **"Upstream Cloudburst"**: Rainfall reaches 95 mm/h. The Random Forest ML engine recalculates risks in real-time.
   - Inspect the **Explainable AI (XAI) Panel**:
     - Real-time **Feature Importances**: Rainfall (35%), Soil Saturation (25%), Water Rise Rate (22%), DEM Slope (12%), Landslide Index (6%).
     - Natural language AI reasoning explanations.

4. **Triggering Critical Emergency & Evacuation**:
   - Select **"Catastrophic Deluge"** (or use the custom sliders to set rainfall >100 mm/h and soil saturation >80%).
   - The system triggers a **CRITICAL RED ALERT**:
     - Emergency audio-visual alert banner activates.
     - Vulnerable low-lying wards (Nandaprayag, Govindghat) pulse on the map.
     - Trigger **"Dispatch CAP Evacuation Alerts"**: Simulates automated Common Alerting Protocol (CAP) SMS broadcasts, emergency responder notifications, and routing to designated highland shelters (e.g. Govindghat Higher Secondary Ground at 1950m).

---

## 📂 Project Structure

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
│   │       ├── ScenarioBar.jsx            # Simulation presets & custom tuning sliders
│   │       ├── RiskSummaryCards.jsx       # 4 KPI cards (Risk score, IMD rain, Hotspot, IoT mesh)
│   │       ├── HillyCatchmentMap.jsx      # Leaflet interactive map with river & risk nodes
│   │       ├── MLInsightsPanel.jsx        # Random Forest explainability & feature weights
│   │       ├── IoTStreamPanel.jsx         # ESP32 edge stream (water level, rise rate, LoRa RSSI)
│   │       └── EvacuationAlertModal.jsx   # Critical alert banner, siren sound, CAP SMS broadcast
│   ├── index.html
│   ├── vite.config.js                     # Configured with proxy to port 5000
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                              # System documentation
```

---

## 🔌 Integrating Real APIs and Hardware

Every service file is cleanly isolated to allow swapping simulated services with real endpoints:

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

## 🏆 Key System Capabilities
- **Solves the Mountain Delay**: Couples upstream slope characteristics and soil saturation to forecast flash flood surges minutes before river surges reach downstream settlements.
- **Disaster Resilience**: LoRaWAN (865 MHz) edge telemetry maintains operational data pipelines even during severe grid or cellular infrastructure failures.
- **Action-Oriented Response**: Generates automated Common Alerting Protocol (CAP) broadcasts, siren triggers, and safe highland evacuation shelter routing.
