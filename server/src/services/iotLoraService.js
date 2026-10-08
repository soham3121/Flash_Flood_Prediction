/**
 * IoT & LoRaWAN Edge Sensor Service (Simulated ESP32 Nodes)
 * 
 * Represents solar-powered ESP32 microcontroller nodes deployed at stream choke points,
 * culverts, and high-altitude tributaries. They transmit telemetry via SX1276 LoRa transceivers
 * to a central regional gateway, providing continuous data even when cellular networks fail.
 */

// Baseline state for each sensor node
const sensorNodesState = {
  "ESP32-NODE-01": { waterLevel_cm: 65, riseRate_cm_min: 0.1, soilMoisture_pct: 38, flowVelocity_m_s: 0.8 },
  "ESP32-NODE-02": { waterLevel_cm: 80, riseRate_cm_min: 0.2, soilMoisture_pct: 42, flowVelocity_m_s: 1.1 },
  "ESP32-NODE-03": { waterLevel_cm: 110, riseRate_cm_min: 0.1, soilMoisture_pct: 45, flowVelocity_m_s: 1.3 },
  "ESP32-NODE-04": { waterLevel_cm: 140, riseRate_cm_min: 0.0, soilMoisture_pct: 40, flowVelocity_m_s: 1.0 },
  "ESP32-NODE-05": { waterLevel_cm: 95, riseRate_cm_min: 0.3, soilMoisture_pct: 48, flowVelocity_m_s: 1.4 },
  "ESP32-NODE-06": { waterLevel_cm: 160, riseRate_cm_min: 0.2, soilMoisture_pct: 43, flowVelocity_m_s: 1.2 }
};

export const iotLoraService = {
  /**
   * Get real-time telemetry stream for all deployed ESP32 nodes
   * 
   * TO CONNECT REAL HARDWARE:
   * Setup an HTTP Webhook or MQTT subscriber from The Things Network (TTN) or ChirpStack:
   * mqttClient.on('message', (topic, message) => { updateNode(JSON.parse(message)); });
   */
  getSensorTelemetry: (nodeId, weatherMultiplier = 1.0) => {
    const base = sensorNodesState[nodeId] || { waterLevel_cm: 80, riseRate_cm_min: 0.1, soilMoisture_pct: 40, flowVelocity_m_s: 1.0 };
    
    // Dynamic calculation based on weather & slope
    const simulatedWaterLevel = +(base.waterLevel_cm * weatherMultiplier + (Math.random() - 0.5) * 4).toFixed(1);
    const simulatedRiseRate = +(base.riseRate_cm_min * weatherMultiplier + (Math.random() * 0.1)).toFixed(2);
    const simulatedSoilMoisture = Math.min(100, +(base.soilMoisture_pct * Math.sqrt(weatherMultiplier)).toFixed(1));
    const simulatedFlowVelocity = +(base.flowVelocity_m_s * Math.pow(weatherMultiplier, 0.4)).toFixed(2);

    // Realistic LoRa telemetry metadata
    return {
      node_id: nodeId,
      hardware: "ESP32-WROOM-32D + Semtech SX1276 LoRa",
      frequency_band: "IN865 (865.0625 MHz)",
      spreading_factor: "SF7 / BW 125kHz",
      rssi_dbm: -(72 + Math.floor(Math.random() * 12)), // -72 to -84 dBm (strong signal)
      snr_db: +(8.5 + (Math.random() - 0.5) * 2).toFixed(1),
      battery_v: +(4.12 - Math.random() * 0.08).toFixed(2),
      packet_loss_rate_pct: 0.2,
      last_packet_age_sec: Math.floor(Math.random() * 4) + 1,
      telemetry: {
        water_level_cm: Math.max(20, simulatedWaterLevel),
        water_rise_rate_cm_min: Math.max(0, simulatedRiseRate),
        soil_moisture_pct: Math.max(10, simulatedSoilMoisture),
        surface_runoff_velocity_m_s: Math.max(0.2, simulatedFlowVelocity)
      }
    };
  },

  /**
   * Adjust sensor state according to scenario multipliers
   */
  updateScenarioMultipliers: (scenarioKey, customSoil = null, customRise = null) => {
    let multiplier = 1.0;
    if (scenarioKey === "MONSOON") multiplier = 1.8;
    if (scenarioKey === "CLOUDBURST") multiplier = 3.5;
    if (scenarioKey === "CATASTROPHIC") multiplier = 5.2;

    // If custom overrides are provided from frontend sliders
    return { multiplier, customSoil, customRise };
  }
};
