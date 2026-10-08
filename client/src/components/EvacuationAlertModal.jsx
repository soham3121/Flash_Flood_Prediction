import React, { useState } from 'react';
import { AlertTriangle, Bell, Send, CheckCircle2, Volume2, VolumeX, X, ShieldAlert } from 'lucide-react';

export default function EvacuationAlertModal({ criticalVillages, onBroadcast, broadcastResult, isBroadcasting }) {
  const [isOpen, setIsOpen] = useState(true);
  const [sirenActive, setSirenActive] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  // Play subtle warning beep via Web Audio API
  const toggleSirenSound = () => {
    if (sirenActive) {
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
      setSirenActive(false);
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setAudioContext(ctx);
        setSirenActive(true);
      } catch (e) {
        console.warn('Audio not allowed without user interaction:', e);
      }
    }
  };

  if (!criticalVillages || criticalVillages.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 max-w-5xl mx-auto">
      <div className="bg-red-950/95 border-2 border-red-500 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl pulse-critical text-white">
        
        {/* Banner Top Row */}
        <div className="flex items-center justify-between gap-3 border-b border-red-800/60 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 rounded-xl animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-extrabold uppercase tracking-wide text-red-200">
                  Critical Early Evacuation Warning
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-bold font-mono tracking-widest">
                  FLASH FLOOD IMMINENT
                </span>
              </div>
              <p className="text-xs text-red-300">
                Random Forest ML predicted surge exceedance for <span className="font-bold underline">{criticalVillages.length} vulnerable settlement(s)</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Siren toggle */}
            <button
              onClick={toggleSirenSound}
              title={sirenActive ? 'Mute Siren' : 'Test Acoustic Siren'}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                sirenActive ? 'bg-red-600 border-white text-white' : 'bg-red-900/60 border-red-700 text-red-200 hover:bg-red-800'
              }`}
            >
              {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{sirenActive ? 'Siren ON' : 'Audio Siren'}</span>
            </button>

            {/* Minimize / Dismiss */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Column 1: Targeted Settlements */}
            <div className="bg-red-900/30 p-3 rounded-lg border border-red-800/40">
              <span className="font-bold text-red-200 block mb-1 uppercase tracking-wider text-[11px]">
                Targeted Low-Lying Wards:
              </span>
              <ul className="space-y-1 font-mono text-red-100">
                {criticalVillages.map((v) => (
                  <li key={v.village_id} className="flex justify-between items-center bg-red-950/60 px-2 py-1 rounded">
                    <span>{v.name}</span>
                    <span className="font-bold text-red-400">{v.ml_prediction.risk_score_pct}% Risk</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Emergency Action Protocol */}
            <div className="bg-red-900/30 p-3 rounded-lg border border-red-800/40">
              <span className="font-bold text-red-200 block mb-1 uppercase tracking-wider text-[11px]">
                Standard Operating Procedure (SOP):
              </span>
              <ul className="space-y-1 text-red-200 text-[11px]">
                <li>✓ Sound 110dB Solar LoRa Acoustic Sirens</li>
                <li>✓ Mobilize SDRF Chamoli Quick Response Team</li>
                <li>✓ Route villagers to higher ground shelters</li>
              </ul>
            </div>

            {/* Column 3: Automated CAP Broadcast Simulator */}
            <div className="bg-red-900/40 p-3 rounded-lg border border-red-700/60 flex flex-col justify-between">
              <div>
                <span className="font-bold text-red-200 block mb-1 uppercase tracking-wider text-[11px]">
                  Emergency Alert Broadcast
                </span>
                <p className="text-[11px] text-red-300 mb-2">
                  Simulates instant automated cell broadcast SMS & WhatsApp push via CAP standard.
                </p>
              </div>

              <button
                onClick={() => onBroadcast(criticalVillages)}
                disabled={isBroadcasting}
                className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-red-700/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBroadcasting ? 'Dispatching...' : 'Dispatch CAP Evacuation Alerts'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Broadcast Confirmation Banner */}
        {broadcastResult && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{broadcastResult.broadcast_id}</strong>: Emergency alert broadcast dispatched to {broadcastResult.channels_activated?.length} channels (NDRF, SDMA, LoRa Sirens, Cell Towers).
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 shrink-0">DISPATCHED</span>
          </div>
        )}

      </div>
    </div>
  );
}
