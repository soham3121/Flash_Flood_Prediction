import React from 'react';
import { Cpu, Waves, Droplets, ArrowUpRight, BatteryCharging, Radio, Gauge } from 'lucide-react';

export default function IoTStreamPanel({ selectedVillage }) {
  if (!selectedVillage) return null;

  const { name, sensor_telemetry } = selectedVillage;
  const { node_id, hardware, frequency_band, rssi_dbm, snr_db, battery_v, telemetry } = sensor_telemetry || {};
  const { water_level_cm, water_rise_rate_cm_min, soil_moisture_pct, surface_runoff_velocity_m_s } = telemetry || {};

  // Water level bar percentage (relative to danger mark of 300cm)
  const waterLevelPct = Math.min(100, Math.round((water_level_cm / 350) * 100));

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              ESP32 Edge Stream ({node_id || 'NODE-01'})
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Deployed: <span className="text-slate-200">{name} Riverbank Station</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 text-emerald-400">
          <Radio className="w-3.5 h-3.5" />
          <span>LoRa: {rssi_dbm || -76} dBm</span>
        </div>
      </div>

      {/* Main Stream Gauges */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Gauge 1: River Depth */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-sky-400" /> Water Depth
            </span>
            <span className="text-[10px] text-slate-500">Ultrasonic</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-white">{water_level_cm || 0}</span>
            <span className="text-xs text-slate-400 font-mono">cm</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, waterLevelPct)}%` }}
            />
          </div>
        </div>

        {/* Gauge 2: Rise Velocity */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-red-400" /> Rise Velocity
            </span>
            <span className="text-[10px] text-slate-500">Derivative</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-red-400">{water_rise_rate_cm_min || 0}</span>
            <span className="text-xs text-slate-400 font-mono">cm/min</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Status: {water_rise_rate_cm_min > 0.8 ? 'Rapid Swelling ⚠️' : 'Stable Flow'}
          </div>
        </div>

        {/* Gauge 3: Soil Moisture */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-amber-400" /> Soil Saturation
            </span>
            <span className="text-[10px] text-slate-500">Capacitive</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-amber-300">{soil_moisture_pct || 0}%</span>
            <span className="text-xs text-slate-400 font-mono">VWC</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Capacity: {soil_moisture_pct > 75 ? 'Saturated (100% Runoff)' : 'Infiltration Active'}
          </div>
        </div>

        {/* Gauge 4: Surface Velocity */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Surface Runoff
            </span>
            <span className="text-[10px] text-slate-500">Doppler Radar</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-indigo-300">{surface_runoff_velocity_m_s || 0}</span>
            <span className="text-xs text-slate-400 font-mono">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Discharge: Estimated High
          </div>
        </div>

      </div>

      {/* LoRa Telemetry Footer */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-1.5">
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          <span>Battery: {battery_v || 4.1}V (Solar OK)</span>
        </div>
        <div>
          <span>Band: {frequency_band?.split(' ')[0] || 'IN865'}</span>
        </div>
        <div className="text-emerald-400">
          <span>Packet Loss: 0.2%</span>
        </div>
      </div>

    </div>
  );
}
