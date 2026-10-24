import React, { useState } from 'react';
import { Sliders, Sun, CloudRain, CloudLightning, AlertTriangle, Play } from 'lucide-react';

const PRESETS = [
  {
    id: "NORMAL",
    label: "Normal Conditions",
    desc: "Baseline clear weather & stream flow",
    icon: Sun,
    color: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10",
    activeColor: "bg-emerald-500/20 border-emerald-500 text-emerald-300"
  },
  {
    id: "MONSOON",
    label: "Sustained Monsoon",
    desc: "28 mm/h continuous valley rain",
    icon: CloudRain,
    color: "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10",
    activeColor: "bg-yellow-500/20 border-yellow-500 text-yellow-300"
  },
  {
    id: "CLOUDBURST",
    label: "Upstream Cloudburst",
    desc: "95 mm/h intense cloudburst surge",
    icon: CloudLightning,
    color: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
    activeColor: "bg-orange-500/20 border-orange-500 text-orange-300"
  },
  {
    id: "CATASTROPHIC",
    label: "Catastrophic Deluge",
    desc: "Supercell cloudburst & river surge",
    icon: AlertTriangle,
    color: "border-red-500/40 text-red-400 hover:bg-red-500/10",
    activeColor: "bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20"
  }
];

export default function ScenarioBar({ activeScenario, onSelectScenario, onApplyCustom, loading }) {
  const [showSliders, setShowSliders] = useState(false);
  const [customRain, setCustomRain] = useState(30);
  const [customSoil, setCustomSoil] = useState(50);
  const [customRise, setCustomRise] = useState(0.5);

  const handleApplySliders = () => {
    onApplyCustom({
      rainfallRate: customRain,
      soilMoisture: customSoil,
      riseRate: customRise
    });
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Play className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Incident Simulation Controls
            </h2>
            <p className="text-xs text-slate-400">
              Select a scenario to simulate real-time AI inference & emergency alerts:
            </p>
          </div>
        </div>

        {/* 1-Click Scenario Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 lg:max-w-2xl">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const isActive = activeScenario === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectScenario(p.id)}
                disabled={loading}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  isActive ? p.activeColor : `bg-slate-900/60 ${p.color}`
                } disabled:opacity-50`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold leading-tight">{p.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">{p.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Slider Controls */}
        <button
          onClick={() => setShowSliders(!showSliders)}
          className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            showSliders 
              ? 'bg-slate-700 text-white border-slate-600' 
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showSliders ? 'Hide Sliders' : 'Custom Tuning'}</span>
        </button>

      </div>

      {/* Expandable Manual Sliders */}
      {showSliders && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fadeIn">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>IMD Rainfall:</span>
              <span className="text-sky-400 font-bold">{customRain} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="160"
              value={customRain}
              onChange={(e) => setCustomRain(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Soil Saturation:</span>
              <span className="text-amber-400 font-bold">{customSoil} %</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={customSoil}
              onChange={(e) => setCustomSoil(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Stream Rise Rate:</span>
              <span className="text-red-400 font-bold">{customRise} cm/min</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={customRise}
              onChange={(e) => setCustomRise(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div>
            <button
              onClick={handleApplySliders}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold tracking-wide shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Evaluating...' : 'Apply Telemetry & Re-Predict'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
