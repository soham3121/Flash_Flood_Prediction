import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { imdWeatherService } from '../services/imdWeatherService.js';
import { isroDemService } from '../services/isroDemService.js';
import { iotLoraService } from '../services/iotLoraService.js';
import { preprocessingPipeline } from '../services/preprocessingPipeline.js';
import { mockRandomForestEngine } from '../services/mockRandomForestEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load villages dataset
let villagesCache = null;
async function getVillages() {
  if (!villagesCache) {
    const data = await readFile(join(__dirname, '../data/villages.json'), 'utf-8');
    villagesCache = JSON.parse(data);
  }
  return villagesCache;
}

// Current simulation settings
let activeScenario = "NORMAL";
let customOverrides = {
  rainfallRate: null,
  soilMoisture: null,
  riseRate: null
};

export const floodController = {
  /**
   * GET /api/flood/status
   * Primary status endpoint: runs ingestion -> preprocessing -> Random Forest ML inference
   * for all monitored villages in the catchment area.
   */
  getStatus: async (req, res) => {
    try {
      const villages = await getVillages();
      const rawWeather = await imdWeatherService.getPrecipitationData();
      
      const { multiplier } = iotLoraService.updateScenarioMultipliers(
        activeScenario,
        customOverrides.soilMoisture,
        customOverrides.riseRate
      );

      const villagePredictions = [];
      let totalRisk = 0;
      let criticalCount = 0;
      let highCount = 0;

      for (const village of villages) {
        const rawTerrain = isroDemService.getTerrainData(village);
        const rawIoT = iotLoraService.getSensorTelemetry(village.iot_sensor_id, multiplier);

        // Apply any manual slider overrides if user tweaked them
        if (customOverrides.soilMoisture !== null) {
          rawIoT.telemetry.soil_moisture_pct = Number(customOverrides.soilMoisture);
        }
        if (customOverrides.riseRate !== null) {
          rawIoT.telemetry.water_rise_rate_cm_min = Number(customOverrides.riseRate);
        }

        // 1. Data Ingestion & Preprocessing
        const processed = preprocessingPipeline.process(rawWeather, rawTerrain, rawIoT);

        // 2. Machine Learning Inference (Random Forest)
        const mlOutput = mockRandomForestEngine.predict(processed.featureVector);

        totalRisk += mlOutput.risk_score_pct;
        if (mlOutput.risk_level === "CRITICAL") criticalCount++;
        if (mlOutput.risk_level === "HIGH") highCount++;

        villagePredictions.push({
          village_id: village.id,
          name: village.name,
          coordinates: village.coordinates,
          elevation_m: village.elevation_m,
          slope_deg: village.slope_deg,
          river_distance_m: village.river_distance_m,
          population: village.population,
          safe_shelter: village.safe_shelter,
          sensor_telemetry: rawIoT,
          processed_metrics: processed.cleanedMetrics,
          ml_prediction: mlOutput
        });
      }

      // Overall catchment summary
      const averageCatchmentRisk = +(totalRisk / villages.length).toFixed(1);
      let catchmentRiskLevel = "LOW";
      if (averageCatchmentRisk >= 75 || criticalCount >= 2) catchmentRiskLevel = "CRITICAL";
      else if (averageCatchmentRisk >= 55 || criticalCount >= 1 || highCount >= 2) catchmentRiskLevel = "HIGH";
      else if (averageCatchmentRisk >= 35) catchmentRiskLevel = "MEDIUM";

      const mostVulnerable = [...villagePredictions].sort((a, b) => 
        b.ml_prediction.risk_score_pct - a.ml_prediction.risk_score_pct
      )[0];

      return res.json({
        success: true,
        timestamp: new Date().toISOString(),
        active_scenario: activeScenario,
        weather_summary: rawWeather,
        lora_gateway_status: {
          gateway_id: "GW-ALAKNANDA-01",
          location: "Chamoli District Emergency Ops Center",
          status: "ONLINE",
          active_nodes: villages.length,
          frequency: "865.2 MHz",
          packet_reception_rate: "99.8%"
        },
        catchment_summary: {
          region_name: "Upper Alaknanda & Rishiganga River Catchment",
          average_risk_score_pct: averageCatchmentRisk,
          risk_level: catchmentRiskLevel,
          total_monitored_population: villages.reduce((acc, v) => acc + v.population, 0),
          critical_villages_count: criticalCount,
          high_villages_count: highCount,
          highest_risk_village: {
            name: mostVulnerable.name,
            score: mostVulnerable.ml_prediction.risk_score_pct,
            level: mostVulnerable.ml_prediction.risk_level
          },
          evacuation_active: catchmentRiskLevel === "CRITICAL" || criticalCount > 0
        },
        villages: villagePredictions
      });
    } catch (error) {
      console.error("Error in floodController.getStatus:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * POST /api/flood/simulate
   * Triggers a specific hackathon demonstration scenario or custom telemetry sliders
   */
  simulateScenario: async (req, res) => {
    try {
      const { scenario, customRainfall, customSoil, customRise } = req.body;

      if (scenario) {
        activeScenario = scenario;
        imdWeatherService.setScenario(scenario);
      }

      if (customRainfall !== undefined && customRainfall !== null) {
        customOverrides.rainfallRate = customRainfall;
        imdWeatherService.setScenario(activeScenario, customRainfall);
      } else if (scenario) {
        customOverrides.rainfallRate = null;
      }

      if (customSoil !== undefined) {
        customOverrides.soilMoisture = customSoil;
      }

      if (customRise !== undefined) {
        customOverrides.riseRate = customRise;
      }

      // Re-run status to return fresh state
      return floodController.getStatus(req, res);
    } catch (error) {
      console.error("Error in floodController.simulateScenario:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * POST /api/flood/alerts/broadcast
   * Simulates automated emergency broadcast via CAP (Common Alerting Protocol)
   */
  broadcastAlert: async (req, res) => {
    try {
      const { villageNames, alertLevel, message } = req.body;

      return res.json({
        success: true,
        broadcast_id: `CAP-ALERT-${Date.now()}`,
        dispatched_at: new Date().toISOString(),
        channels_activated: [
          "State Disaster Management Authority (SDMA) Uttarakhand Webhook",
          "NDRF 8th Battalion Dispatch Radio",
          "Regional LoRaWAN Siren Beacons (110dB Audio Siren)",
          "BSOC Local Cell Broadcast (SMS to all mobile subscribers in cell tower)",
          "District Magistrate Emergency WhatsApp Group"
        ],
        villages_targeted: villageNames || ["All Critical Villages"],
        alert_level: alertLevel || "CRITICAL",
        broadcast_payload: message || "EMERGENCY: FLASH FLOOD WARNING ISSUED. EVACUATE LOW-LYING AREAS IMMEDIATELY TO DESIGNATED SHELTER GROUNDS."
      });
    } catch (error) {
      console.error("Error in floodController.broadcastAlert:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};
