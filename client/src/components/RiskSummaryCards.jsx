import React from 'react';
import { AlertCircle, CloudRain, Cpu, ShieldCheck, TrendingUp, Compass, MapPin } from 'lucide-react';

export default function RiskSummaryCards({ catchmentSummary, weatherSummary, loraStatus, villages }) {
  const avgRisk = catchmentSummary?.average_risk_score_pct || 0;
  const riskLevel = catchmentSummary?.risk_level || 'LOW';
  const highest = catchmentSummary?.highest_risk_village;
  const totalPop = catchmentSummary?.total_monitored_population || 0;

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return {
          border: 'border-red-500/40',
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          bar: 'bg-red-500'
        };
      case 'HIGH':
        return {
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          bar: 'bg-orange-500'
        };
      case 'MEDIUM':
        return {
          border: 'border-yellow-500/40',
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          bar: 'bg-yellow-500'
        };
      default:
        return {
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          bar: 'bg-emerald-500'
        };
    }
  };

  const riskStyle = getRiskColor(riskLevel);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Catchment Risk Index */}
      <div className={`p-4 rounded-xl bg-[#111827] border ${riskStyle.border} shadow-lg flex flex-col justify-between`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Catchment Risk Score
          </span>
          <div className={`p-1.5 rounded-lg ${riskStyle.bg} ${riskStyle.text}`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className={`text-3xl font-extrabold tracking-tight ${riskStyle.text}`}>
            {avgRisk}%
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
            {riskLevel}
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${riskStyle.bar}`}
            style={{ width: `${Math.min(100, Math.max(5, avgRisk))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>Target: Upper Alaknanda</span>
          <span className="font-mono">{catchmentSummary?.critical_villages_count || 0} Critical Wards</span>
        </div>
      </div>

      {/* Card 2: IMD Doppler Weather Radar */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            IMD Precipitation Rate
          </span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <CloudRain className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-3xl font-extrabold text-white font-mono">
            {weatherSummary?.rainfallRate_mm_hr || 0}
          </span>
          <span className="text-xs text-slate-400 font-mono">mm/hour</span>
        </div>

        <div className="text-xs text-slate-300 font-medium line-clamp-1">
          {weatherSummary?.status || 'Analyzing radar stream...'}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <span>3h Acc: {weatherSummary?.cumulative3h_mm || 0} mm</span>
          <span className="font-mono text-sky-400">{weatherSummary?.radarReflectivity_dBZ || 0} dBZ</span>
        </div>
      </div>

      {/* Card 3: Most Vulnerable Ward */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Highest Risk Settlement
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="text-lg font-bold text-white truncate">
            {highest?.name || 'Assessing data...'}
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-xs font-semibold text-amber-400">
              Risk: {highest?.score || 0}%
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Tier: {highest?.level || 'LOW'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <span>Shelter Protocol</span>
          <span className="text-emerald-400 font-medium">Mapped & Ready</span>
        </div>
      </div>

      {/* Card 4: IoT Edge LoRaWAN Mesh */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            IoT Edge Sensor Mesh
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-3xl font-extrabold text-white font-mono">
            {loraStatus?.active_nodes || villages?.length || 6}
          </span>
          <span className="text-xs text-emerald-400 font-medium">ESP32 Nodes Active</span>
        </div>

        <div className="text-xs text-slate-300 font-mono">
          LoRa Band: {loraStatus?.frequency || '865 MHz'} (Offline Ready)
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <span>Population Covered</span>
          <span className="font-mono text-slate-200">{totalPop.toLocaleString()} Citizens</span>
        </div>
      </div>

    </div>
  );
}
