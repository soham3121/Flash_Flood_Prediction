/**
 * Mock Random Forest Machine Learning Engine
 * 
 * In production:
 * This module connects to a trained scikit-learn RandomForestClassifier
 * exported via joblib/ONNX or served via a Python FastAPI endpoint.
 * 
 * For this prototype:
 * Evaluates multi-source feature vectors using ensemble trees to predict
 * flash flood probability (0-100%), classification tier, feature importances,
 * and natural language reasoning.
 */

export const mockRandomForestEngine = {
  predict: (features) => {
    const {
      norm_rainfall,
      norm_soil_moisture,
      norm_rise_rate,
      norm_slope,
      norm_proximity,
      norm_landslide,
      norm_runoff_generated
    } = features;

    // Simulate 10 Decision Trees with varied threshold splits
    const treeVotes = [];

    // Tree 1: Rainfall + Soil Saturation Gate
    treeVotes.push(norm_rainfall > 0.45 && norm_soil_moisture > 0.55 ? 0.90 : norm_rainfall * 0.45);

    // Tree 2: Rapid River Surge Choke Point
    treeVotes.push(norm_rise_rate > 0.4 && norm_proximity > 0.4 ? 0.95 : norm_rise_rate * 0.55);

    // Tree 3: Steep Slope Runoff Concentration
    treeVotes.push(norm_slope > 0.55 && norm_runoff_generated > 0.35 ? 0.88 : norm_runoff_generated * 0.5);

    // Tree 4: Coupled Cloudburst Extreme
    treeVotes.push(norm_rainfall > 0.65 ? 0.98 : (norm_rainfall + norm_soil_moisture) / 2);

    // Tree 5: Landslide + Saturated Soil Damming Risk
    treeVotes.push(norm_landslide > 0.6 && norm_soil_moisture > 0.65 ? 0.92 : norm_landslide * 0.4);

    // Tree 6: Hydrological Weighted Combination
    treeVotes.push(
      norm_rainfall * 0.35 +
      norm_soil_moisture * 0.25 +
      norm_rise_rate * 0.22 +
      norm_slope * 0.12 +
      norm_landslide * 0.06
    );

    // Tree 7: Deep Valley River Distance Buffer
    treeVotes.push(norm_proximity > 0.5 && norm_runoff_generated > 0.45 ? 0.93 : norm_proximity * 0.4);

    // Tree 8: High Soil Moisture Base Flow Surge
    treeVotes.push(norm_soil_moisture > 0.75 ? 0.82 + norm_rise_rate * 0.18 : norm_soil_moisture * 0.45);

    // Tree 9: Extreme Rainfall Rate Dominance
    treeVotes.push(norm_rainfall > 0.55 && norm_rise_rate > 0.3 ? 0.96 : norm_rainfall * 0.5);

    // Tree 10: Multi-factor Runoff & Elevation Funnel
    treeVotes.push(
      (norm_runoff_generated * 0.45 + norm_proximity * 0.35 + norm_slope * 0.2)
    );

    // Ensemble Average (Random Forest Bagging Aggregation)
    const rawScore = treeVotes.reduce((sum, v) => sum + v, 0) / treeVotes.length;
    
    // Scale to percentage (0 - 100)
    const riskPercentage = +(Math.min(100, Math.max(5, rawScore * 100))).toFixed(1);

    // Risk Classification Tiers:
    // Low: 0 - 34%
    // Medium: 35 - 59%
    // High: 60 - 79%
    // Critical: >= 80%
    let riskLevel = "LOW";
    let alertColor = "#10B981"; // Emerald green
    let evacuationRecommended = false;

    if (riskPercentage >= 78) {
      riskLevel = "CRITICAL";
      alertColor = "#EF4444"; // Vivid Red
      evacuationRecommended = true;
    } else if (riskPercentage >= 55) {
      riskLevel = "HIGH";
      alertColor = "#F97316"; // Bright Orange
      evacuationRecommended = true;
    } else if (riskPercentage >= 32) {
      riskLevel = "MEDIUM";
      alertColor = "#EAB308"; // Amber / Yellow
      evacuationRecommended = false;
    } else {
      riskLevel = "LOW";
      alertColor = "#10B981"; // Emerald Green
      evacuationRecommended = false;
    }

    // Feature Importances (MDI - Mean Decrease in Impurity simulation)
    const featureImportances = [
      { name: "Rainfall Intensity (IMD)", weight: 35, impact: +(norm_rainfall * 35).toFixed(1) },
      { name: "Soil Saturation (IoT)", weight: 25, impact: +(norm_soil_moisture * 25).toFixed(1) },
      { name: "Water Rise Rate (LoRa)", weight: 22, impact: +(norm_rise_rate * 22).toFixed(1) },
      { name: "Slope Gradient (DEM)", weight: 12, impact: +(norm_slope * 12).toFixed(1) },
      { name: "Landslide Susceptibility", weight: 6, impact: +(norm_landslide * 6).toFixed(1) }
    ];

    // Explainability Reasoning (XAI - Explainable AI)
    const reasoningKeyFactors = [];
    if (norm_rainfall > 0.5) reasoningKeyFactors.push("High intensity precipitation (>60 mm/h)");
    if (norm_soil_moisture > 0.7) reasoningKeyFactors.push("Soil saturation above 70%, triggering Horton overland flow");
    if (norm_rise_rate > 0.3) reasoningKeyFactors.push("Rapid stream surge detected by upstream LoRa sensor");
    if (norm_slope > 0.5) reasoningKeyFactors.push("Steep slope gradient (>30°) accelerating runoff velocity");
    if (norm_proximity > 0.5) reasoningKeyFactors.push("Proximity (<120m) to active river channel");

    const reasoning = reasoningKeyFactors.length > 0 
      ? reasoningKeyFactors.join("; ") 
      : "All hydrologic and terrain indicators are within normal seasonal limits.";

    return {
      model_name: "RandomForestEnsemble-HillyCatchment-v1.4",
      trees_evaluated: 10,
      confidence_pct: +(91.2 + (Math.random() - 0.5) * 4).toFixed(1),
      risk_score_pct: riskPercentage,
      risk_level: riskLevel,
      alert_color: alertColor,
      evacuation_recommended: evacuationRecommended,
      feature_importances: featureImportances,
      reasoning: reasoning
    };
  }
};
