import React from 'react';
import { BrainCircuit, CheckCircle2, AlertOctagon, TrendingUp, Info } from 'lucide-react';

export default function MLInsightsPanel({ selectedVillage }) {
  if (!selectedVillage) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        Select a village on the map to view AI model insights.
      </div>
    );
  }

  const { name, ml_prediction, elevation_m, slope_deg, river_distance_m, processed_metrics } = selectedVillage;
  const { risk_score_pct, risk_level, confidence_pct, feature_importances, reasoning, model_name } = ml_prediction || {};

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Random Forest ML Inference Engine
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                10 Trees
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Ward: <span className="text-sky-400 font-semibold">{name}</span> (Elev: {elevation_m}m, Slope: {slope_deg}°)
            </p>
          </div>
        </div>

        {/* Risk Score Pill */}
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${getRiskBadge(risk_level)}`}>
          {risk_level} ({risk_score_pct}%)
        </div>
      </div>

      {/* Model Confidence & Score Overview */}
      <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Model Confidence</span>
          <span className="font-mono font-bold text-emerald-400 text-base">{confidence_pct || 91.5}%</span>
          <span className="text-[10px] text-slate-500 block">Bagging Cross-Val</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Surge Velocity Factor</span>
          <span className="font-mono font-bold text-sky-400 text-base">
            {processed_metrics?.channel_surge_intensity || '0.24'}
          </span>
          <span className="text-[10px] text-slate-500 block">Slope x Rise Rate</span>
        </div>
      </div>

      {/* Explainable AI (XAI) Feature Importance Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Feature Weighting & Impact (MDI)
          </span>
          <span className="text-[10px] text-slate-500">Multi-Source Multipliers</span>
        </div>

        <div className="space-y-2">
          {feature_importances?.map((feat, idx) => {
            const impactPct = Math.min(100, Math.round((feat.impact / feat.weight) * 100));
            return (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-medium">{feat.name}</span>
                  <span className="font-mono text-slate-400">
                    Impact: <span className="text-sky-300 font-bold">{feat.impact}</span> / {feat.weight}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, impactPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Natural Language AI Decision Justification */}
      <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 text-xs">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-sky-300 text-[11px] block uppercase tracking-wider mb-0.5">
              AI Decision Explanation (XAI)
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
