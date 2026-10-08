import React from 'react';
import { X, Layers, Cpu, Database, BrainCircuit, Radio, Shield, Code, CheckCircle } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0F172A] border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Smart India Hackathon (SIH) Technical Architecture
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End Design: Multi-Source Ingestion • Edge LoRaWAN • Random Forest ML • CAP Alerting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* Section 1: Problem & Approach */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Core Problem & Value Proposition
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Hilly terrains (e.g. Alaknanda / Mandi basins) suffer from sudden cloudbursts where water travels down steep mountain slopes in minutes, causing devastating flash floods before plain-region hydrological models can react. DRAIN-SHIELD solves this by fusing <strong>satellite DEM slope dynamics</strong>, <strong>IMD rainfall radar</strong>, and <strong>low-cost solar ESP32 stream nodes</strong> transmitting over <strong>long-range LoRaWAN (865 MHz)</strong> that stays online even when cell towers collapse.
            </p>
          </div>

          {/* Section 2: 4-Tier Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs mb-2">
                  <Database className="w-4 h-4" />
                  <span>1. Multi-Source Ingestion</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• <strong>IMD Weather</strong>: Radar (dBZ) & rainfall rate (mm/h)</li>
                  <li>• <strong>ISRO Bhuvan DEM</strong>: 30m Cartosat slope gradient & flow paths</li>
                  <li>• <strong>GSI</strong>: Landslide hazard inventory</li>
                </ul>
              </div>
              <span className="mt-3 text-[10px] font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded">
                services/imdWeatherService.js
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-2">
                  <Radio className="w-4 h-4" />
                  <span>2. Edge LoRa Mesh</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• <strong>ESP32 Microcontrollers</strong></li>
                  <li>• Ultrasonic river depth gauge</li>
                  <li>• Capacitive soil moisture %</li>
                  <li>• <strong>LoRaWAN IN865</strong> (15km mountain range, battery backup)</li>
                </ul>
              </div>
              <span className="mt-3 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                services/iotLoraService.js
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs mb-2">
                  <BrainCircuit className="w-4 h-4" />
                  <span>3. Feature Pipeline & ML</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• <strong>Horton Runoff Index</strong></li>
                  <li>• Surge velocity coupling</li>
                  <li>• <strong>Random Forest Ensemble</strong> (10 trees with bagging)</li>
                  <li>• Mean Decrease in Impurity (MDI)</li>
                </ul>
              </div>
              <span className="mt-3 text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">
                services/mockRandomForestEngine.js
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-red-400 font-bold text-xs mb-2">
                  <Shield className="w-4 h-4" />
                  <span>4. Early Warning & SOP</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-300">
                  <li>• Ward-level risk heatmap</li>
                  <li>• Critical threshold triggers</li>
                  <li>• <strong>CAP XML/JSON standard</strong></li>
                  <li>• Automated sirens & SMS</li>
                </ul>
              </div>
              <span className="mt-3 text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
                controllers/floodController.js
              </span>
            </div>

          </div>

          {/* Section 3: Developer Guide - How to Replace Mocks with Real APIs */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code className="w-4 h-4" /> Developer Guide: Swapping Mocks with Real Python / APIs
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              The codebase is organized cleanly into modular services with explicit comments so your team can easily customize it:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-semibold">// 1. To connect real Python Scikit-Learn / FastAPI:</span><br/>
                Inside <span className="text-sky-300">server/src/services/mockRandomForestEngine.js</span>, change the return to:<br/>
                <span className="text-slate-400">const res = await fetch('http://localhost:8000/predict', &#123; method: 'POST', body: JSON.stringify(features) &#125;);</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-semibold">// 2. To connect real ESP32 Hardware via MQTT / LoRa Gateway:</span><br/>
                Inside <span className="text-sky-300">server/src/services/iotLoraService.js</span>, subscribe to your ChirpStack or The Things Network (TTN) MQTT broker.
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-semibold">// 3. To connect real IMD Weather API / Open-Meteo:</span><br/>
                Inside <span className="text-sky-300">server/src/services/imdWeatherService.js</span>, paste your weather API key and latitude/longitude coordinates.
              </div>
            </div>
          </div>

          {/* Section 4: SIH Roadmap Checklist */}
          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Ready for SIH Evaluator Presentation
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Demonstrates multi-source sensor and GIS data fusion concept.</li>
              <li>Explains Random Forest ML reasoning to judges without black-box confusion.</li>
              <li>Solves communication breakdown during disasters with LoRaWAN mesh design.</li>
              <li>Includes action-oriented evacuation protocols and village-level shelter routing.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
          >
            Close Architecture View
          </button>
        </div>

      </div>
    </div>
  );
}
