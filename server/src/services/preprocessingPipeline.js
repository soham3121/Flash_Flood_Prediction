/**
 * Preprocessing & Feature Engineering Pipeline
 * 
 * Simulates data cleaning, normalization, and feature extraction.
 * Fuses:
 * 1. Meteorological: Rainfall rate (IMD)
 * 2. Geo-spatial: Elevation, slope gradient, river distance (ISRO Bhuvan DEM)
 * 3. IoT Edge: Water level, rise rate, soil moisture (ESP32 LoRaWAN stream)
 * 4. Geological: Historical landslide hazard inventory (GSI)
 */

export const preprocessingPipeline = {
  process: (rawWeather, rawTerrain, rawIoT) => {
    // 1. Data Cleaning & Range Clamping
    const rainfallRate = Math.max(0, Math.min(300, rawWeather.rainfallRate_mm_hr || 0));
    const soilMoisture = Math.max(0, Math.min(100, rawIoT.telemetry.soil_moisture_pct || 40));
    const waterLevel = Math.max(10, Math.min(800, rawIoT.telemetry.water_level_cm || 50));
    const riseRate = Math.max(0, Math.min(30, rawIoT.telemetry.water_rise_rate_cm_min || 0));
    const slopeDeg = Math.max(5, Math.min(65, rawTerrain.slope_deg || 25));
    const riverDist = Math.max(10, Math.min(2000, rawTerrain.river_distance_m || 200));
    const landslideIndex = Math.max(0, Math.min(1.0, rawTerrain.landslide_hazard_index || 0.5));

    // 2. Hydrological Feature Engineering:
    // Horton's overland flow: saturated soils convert rainfall into immediate runoff
    const saturationRatio = soilMoisture / 100.0;
    const effectiveRunoffRate = +(rainfallRate * Math.pow(saturationRatio, 1.6)).toFixed(2);

    // Channel Surge: rise rate amplified by steep gorge slope
    const channelSurgeIntensity = +(riseRate * (slopeDeg / 25.0)).toFixed(2);

    // Proximity factor: close distance to river (<150m) in high slope is extreme risk
    const proximityDangerScore = +(
      (1 - Math.min(riverDist, 300) / 300) * (slopeDeg / 35.0)
    ).toFixed(2);

    // 3. Min-Max Normalization (0.0 to 1.0)
    // Note: in mountainous streams, 2.0 cm/min is already severe rapid swelling
    const normalizedFeatures = {
      norm_rainfall: +(Math.min(rainfallRate / 100.0, 1.0)).toFixed(3),
      norm_soil_moisture: +(soilMoisture / 100.0).toFixed(3),
      norm_rise_rate: +(Math.min(riseRate / 2.0, 1.0)).toFixed(3),
      norm_slope: +(Math.min(slopeDeg / 45.0, 1.0)).toFixed(3),
      norm_proximity: +(Math.max(0, 1 - riverDist / 250.0)).toFixed(3),
      norm_landslide: +landslideIndex.toFixed(3),
      norm_runoff_generated: +(Math.min(effectiveRunoffRate / 80.0, 1.0)).toFixed(3)
    };

    return {
      cleanedMetrics: {
        rainfallRate_mm_hr: rainfallRate,
        soilMoisture_pct: soilMoisture,
        waterLevel_cm: waterLevel,
        riseRate_cm_min: riseRate,
        slope_deg: slopeDeg,
        river_distance_m: riverDist,
        effective_runoff_rate: effectiveRunoffRate,
        channel_surge_intensity: channelSurgeIntensity,
        proximity_danger_score: proximityDangerScore
      },
      featureVector: normalizedFeatures
    };
  }
};
