import React, { useState, useEffect } from 'react';
import { ShieldAlert, Radio, Activity, BookOpen, Mountain, RefreshCw } from 'lucide-react';

export default function Navbar({ catchmentSummary, loraStatus, onOpenArchitecture, onRefresh, loading }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const riskLevel = catchmentSummary?.risk_level || 'LOW';
  
  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                DRAIN-SHIELD
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  SIH PROTOTYPE
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Flash Flood Early Warning System for Hilly Terrains • Multi-Source AI + LoRaWAN
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          {/* LoRa Gateway Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300 font-mono">
              LoRa Gateway: <span className="text-emerald-400 font-semibold">{loraStatus?.status || 'ONLINE'}</span>
            </span>
          </div>

          {/* Regional Risk Level Pill */}
          <div className={`px-3 py-1.5 rounded-lg border font-semibold tracking-wide flex items-center gap-1.5 ${getRiskBadge(riskLevel)}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>REGION RISK: {riskLevel}</span>
          </div>

          {/* Clock & Refresh */}
          <div className="flex items-center space-x-2">
            <span className="font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              {currentTime}
            </span>
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh telemetry"
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>

          {/* Architecture / SIH Judges button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-300 hover:bg-sky-600/30 transition-colors font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SIH System Architecture</span>
          </button>

        </div>

      </div>
    </header>
  );
}
