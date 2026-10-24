/**
 * IMD Weather Service (Simulated & Pluggable)
 * 
 * In a production deployment, this module connects to India Meteorological Department (IMD)
 * radar stations, Automatic Weather Stations (AWS), or OpenWeatherMap / Open-Meteo APIs.
 * 
 * Provides realistic multi-station rainfall telemetry.
 */

// Preset scenario values for IMD rainfall
const WEATHER_SCENARIOS = {
  NORMAL: {
    name: "Normal Weather",
    rainfallRate_mm_hr: 2.5,
    cumulative3h_mm: 7.0,
    radarReflectivity_dBZ: 18,
    cloudburstRisk: "Nil",
    status: "Clear / Light Drizzle"
  },
  MONSOON: {
    name: "Sustained Monsoon Rain",
    rainfallRate_mm_hr: 28.0,
    cumulative3h_mm: 72.0,
    radarReflectivity_dBZ: 42,
    cloudburstRisk: "Moderate",
    status: "Heavy Convective Rainfall"
  },
  CLOUDBURST: {
    name: "Upstream Cloudburst Event",
    rainfallRate_mm_hr: 95.0,
    cumulative3h_mm: 180.0,
    radarReflectivity_dBZ: 58,
    cloudburstRisk: "Severe",
    status: "Extreme Cloudburst Recorded (>75mm/h)"
  },
  CATASTROPHIC: {
    name: "Catastrophic Torrential Deluge",
    rainfallRate_mm_hr: 145.0,
    cumulative3h_mm: 290.0,
    radarReflectivity_dBZ: 66,
    cloudburstRisk: "Catastrophic",
    status: "Super-Cell Cloudburst with Upstream Dam Overflow"
  }
};

let currentWeatherState = { ...WEATHER_SCENARIOS.NORMAL };

export const imdWeatherService = {
  /**
   * Fetch current IMD radar & precipitation telemetry
   * 
   * TO CONNECT REAL API:
   * const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=30.55&longitude=79.56&hourly=rain`);
   * return await response.json();
   */
  getPrecipitationData: async () => {
    // Add realistic subtle jitter (+/- 3%) to simulate live sensor fluctuations
    const jitter = (Math.random() - 0.5) * 0.06;
    const currentRate = Math.max(0, +(currentWeatherState.rainfallRate_mm_hr * (1 + jitter)).toFixed(1));

    return {
      source: "IMD Doppler Weather Radar (Mukteshwar / Srinagar UK)",
      timestamp: new Date().toISOString(),
      rainfallRate_mm_hr: currentRate,
      cumulative3h_mm: currentWeatherState.cumulative3h_mm,
      radarReflectivity_dBZ: currentWeatherState.radarReflectivity_dBZ,
      cloudburstRisk: currentWeatherState.cloudburstRisk,
      status: currentWeatherState.status
    };
  },

  /**
   * Update weather simulation based on chosen scenario or manual slider
   */
  setScenario: (scenarioKey, customRate = null) => {
    if (WEATHER_SCENARIOS[scenarioKey]) {
      currentWeatherState = { ...WEATHER_SCENARIOS[scenarioKey] };
    }
    if (customRate !== null && !isNaN(customRate)) {
      currentWeatherState.rainfallRate_mm_hr = Number(customRate);
      currentWeatherState.cumulative3h_mm = +(customRate * 2.1).toFixed(1);
      currentWeatherState.radarReflectivity_dBZ = Math.min(70, +(20 + customRate * 0.4).toFixed(1));
      currentWeatherState.status = customRate > 75 ? "Extreme Cloudburst (>75mm/h)" : customRate > 25 ? "Heavy Rain" : "Moderate Rain";
    }
    return currentWeatherState;
  }
};
