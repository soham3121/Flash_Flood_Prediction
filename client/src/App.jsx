import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScenarioBar from './components/ScenarioBar';
import RiskSummaryCards from './components/RiskSummaryCards';
import HillyCatchmentMap from './components/HillyCatchmentMap';
import MLInsightsPanel from './components/MLInsightsPanel';
import IoTStreamPanel from './components/IoTStreamPanel';
import EvacuationAlertModal from './components/EvacuationAlertModal';
import { Table, ShieldAlert, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Fetch live system status from Express backend
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/flood/status');
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      setData(json);
      
      // If no village is selected yet, select the most vulnerable one
      if (json.villages && json.villages.length > 0) {
        setSelectedVillage((prev) => {
          if (!prev) {
            return json.villages.slice().sort((a, b) => b.ml_prediction.risk_score_pct - a.ml_prediction.risk_score_pct)[0];
          }
          // Update existing selected village with fresh telemetry
          return json.villages.find((v) => v.village_id === prev.village_id) || json.villages[0];
        });
      }
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh telemetry every 15 seconds
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle 1-click scenario simulation change
  const handleSelectScenario = async (scenarioKey) => {
    try {
      setLoading(true);
      setBroadcastResult(null); // Reset prior broadcast message
      const res = await fetch('/api/flood/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioKey })
      });
      const json = await res.json();
      setData(json);

      if (json.villages && json.villages.length > 0) {
        setSelectedVillage((prev) => {
          if (!prev) return json.villages[0];
          return json.villages.find((v) => v.village_id === prev.village_id) || json.villages[0];
        });
      }
    } catch (err) {
      console.error('Scenario error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle custom manual tuning sliders
  const handleApplyCustom = async (sliders) => {
    try {
      setLoading(true);
      const res = await fetch('/api/flood/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customRainfall: sliders.rainfallRate,
          customSoil: sliders.soilMoisture,
          customRise: sliders.riseRate
        })
      });
      const json = await res.json();
      setData(json);

      if (json.villages && json.villages.length > 0) {
        setSelectedVillage((prev) => {
          if (!prev) return json.villages[0];
          return json.villages.find((v) => v.village_id === prev.village_id) || json.villages[0];
        });
      }
    } catch (err) {
      console.error('Custom telemetry error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dispatch emergency broadcast
  const handleBroadcastAlert = async (criticalVillages) => {
    try {
      setIsBroadcasting(true);
      const villageNames = criticalVillages.map((v) => v.name);
      const res = await fetch('/api/flood/alerts/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villageNames,
          alertLevel: 'CRITICAL',
          message: `URGENT FLASH FLOOD ALERT for ${villageNames.join(', ')}. River water rising rapidly. Move to designated high-ground shelters immediately.`
        })
      });
      const result = await res.json();
      setBroadcastResult(result);
    } catch (err) {
      console.error('Broadcast error:', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const criticalVillages = data?.villages?.filter(
    (v) => v.ml_prediction?.risk_level === 'CRITICAL' || v.ml_prediction?.risk_level === 'HIGH'
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        catchmentSummary={data?.catchment_summary}
        loraStatus={data?.lora_gateway_status}
        onRefresh={fetchStatus}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Connection Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Could not connect to the API server. Please check your connection.</span>
            </div>
            <button
              onClick={fetchStatus}
              className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-semibold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Incident Scenario Bar */}
        <ScenarioBar
          activeScenario={data?.active_scenario || 'NORMAL'}
          onSelectScenario={handleSelectScenario}
          onApplyCustom={handleApplyCustom}
          loading={loading}
        />

        {/* 4 Key KPI Metrics Cards */}
        <RiskSummaryCards
          catchmentSummary={data?.catchment_summary}
          weatherSummary={data?.weather_summary}
          loraStatus={data?.lora_gateway_status}
          villages={data?.villages}
        />

        {/* Interactive Map & Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Leaflet Mountain Catchment Map */}
          <div className="lg:col-span-7">
            <HillyCatchmentMap
              villages={data?.villages || []}
              selectedVillage={selectedVillage}
              onSelectVillage={(v) => setSelectedVillage(v)}
            />
          </div>

          {/* Right Column (5 cols): ML Explainability & IoT Telemetry Panels */}
          <div className="lg:col-span-5 space-y-6">
            <MLInsightsPanel selectedVillage={selectedVillage} />
            <IoTStreamPanel selectedVillage={selectedVillage} />
          </div>

        </div>

        {/* Village Risk Comparison Matrix */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Table className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Monitored Catchment Settlements & Vulnerability Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Ward-level risk score, elevation profile, and safe evacuation shelter status
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Monitored: {data?.villages?.length || 0} Settlements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Settlement / Ward</th>
                  <th className="pb-3">Elevation</th>
                  <th className="pb-3">Slope (DEM)</th>
                  <th className="pb-3">River Distance</th>
                  <th className="pb-3">IoT Water Depth</th>
                  <th className="pb-3">ML Risk Score</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {data?.villages?.map((v) => {
                  const risk = v.ml_prediction?.risk_score_pct || 0;
                  const level = v.ml_prediction?.risk_level || 'LOW';
                  const isSelected = selectedVillage?.village_id === v.village_id;

                  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                  if (level === 'CRITICAL') badgeColor = 'bg-red-500/20 text-red-400 border-red-500/40 font-bold animate-pulse';
                  else if (level === 'HIGH') badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
                  else if (level === 'MEDIUM') badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';

                  return (
                    <tr
                      key={v.village_id}
                      onClick={() => setSelectedVillage(v)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-950/40 text-white font-medium' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 pl-2 font-sans font-semibold text-slate-100">
                        {v.name}
                      </td>
                      <td className="py-3">{v.elevation_m} m</td>
                      <td className="py-3">{v.slope_deg}°</td>
                      <td className="py-3">{v.river_distance_m} m</td>
                      <td className="py-3 text-sky-400">
                        {v.sensor_telemetry?.telemetry?.water_level_cm} cm
                      </td>
                      <td className="py-3 font-bold text-white">
                        {risk}%
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeColor}`}>
                          {level}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVillage(v);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Critical Early Evacuation Warning Banner & Broadcast Simulator */}
      <EvacuationAlertModal
        criticalVillages={criticalVillages}
        onBroadcast={handleBroadcastAlert}
        broadcastResult={broadcastResult}
        isBroadcasting={isBroadcasting}
      />

    </div>
  );
}
