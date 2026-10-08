import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Layers, Shield, Navigation } from 'lucide-react';

export default function HillyCatchmentMap({ villages, selectedVillage, onSelectVillage }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const riverPolylineRef = useRef(null);
  const shelterMarkersRef = useRef([]);

  // River path through the Himalayan valley
  const RIVER_COORDINATES = [
    [30.6300, 79.5650], // Govindghat upper stream
    [30.6253, 79.5611],
    [30.5900, 79.5630],
    [30.5564, 79.5659], // Joshimath gorge
    [30.5100, 79.5200],
    [30.4700, 79.4700],
    [30.4300, 79.4310], // Pipalkoti
    [30.4100, 79.3700],
    [30.4030, 79.3320], // Chamoli Gopeshwar
    [30.3600, 79.3280],
    [30.3300, 79.3240], // Nandaprayag confluence
    [30.2900, 79.2700],
    [30.2600, 79.2170]  // Karnaprayag
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.45, 79.42],
        zoom: 10,
        minZoom: 8,
        maxZoom: 15,
        scrollWheelZoom: true,
      });

      // Standard OSM + Topographic styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ISRO Bhuvan DEM',
        maxZoom: 18,
      }).addTo(map);

      // Add River Stream Polyline
      const riverLine = L.polyline(RIVER_COORDINATES, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 6',
        lineCap: 'round'
      }).addTo(map);
      riverLine.bindTooltip("🌊 Alaknanda - Rishiganga Main River Channel (Flood Corridor)", {
        sticky: true,
        className: 'bg-slate-900 text-sky-300 font-mono text-xs border border-sky-500/30'
      });
      riverPolylineRef.current = riverLine;

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map persistent across state updates
    };
  }, []);

  // Update Village & Shelter Markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !villages || villages.length === 0) return;

    // Clear existing village markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Clear existing shelter markers
    shelterMarkersRef.current.forEach((marker) => marker.remove());
    shelterMarkersRef.current = [];

    villages.forEach((village) => {
      const { coordinates, name, ml_prediction, elevation_m, slope_deg, safe_shelter } = village;
      const riskScore = ml_prediction?.risk_score_pct || 0;
      const riskLevel = ml_prediction?.risk_level || 'LOW';
      const isSelected = selectedVillage?.village_id === village.village_id;

      // Color mapping
      let colorBg = 'bg-emerald-500';
      let borderGlow = 'border-emerald-400';
      let pulseClass = '';

      if (riskLevel === 'CRITICAL') {
        colorBg = 'bg-red-500';
        borderGlow = 'border-red-400';
        pulseClass = 'pulse-critical';
      } else if (riskLevel === 'HIGH') {
        colorBg = 'bg-orange-500';
        borderGlow = 'border-orange-400';
      } else if (riskLevel === 'MEDIUM') {
        colorBg = 'bg-yellow-500';
        borderGlow = 'border-yellow-400';
      }

      // Custom Village Marker Icon
      const villageIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer ${isSelected ? 'scale-125' : ''} transition-transform">
          <div class="w-8 h-8 rounded-full ${colorBg} ${pulseClass} border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[11px] font-mono">
            ${Math.round(riskScore)}%
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-slate-900/90 text-slate-200 border border-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow">
            ${name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: villageIconHtml,
        className: 'custom-village-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(coordinates, { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-1 text-xs">
          <div class="flex items-center justify-between pb-1 border-b border-slate-700">
            <h3 class="font-bold text-sm text-white">${name}</h3>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono text-white ${colorBg}">
              ${riskLevel} (${riskScore}%)
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-slate-300">
            <div>Elevation: <span class="text-white font-bold">${elevation_m}m</span></div>
            <div>Slope: <span class="text-white font-bold">${slope_deg}°</span></div>
            <div>River Dist: <span class="text-white font-bold">${village.river_distance_m}m</span></div>
            <div>Population: <span class="text-white font-bold">${village.population.toLocaleString()}</span></div>
          </div>
          <div class="mt-2 pt-1 border-t border-slate-700/80 text-[11px] text-sky-400">
            📍 Safe Shelter: <span class="text-slate-200">${safe_shelter?.name || 'Designated High Ground'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectVillage(village);
      });

      markersRef.current.push(marker);

      // Add Safe Evacuation Shelter Marker
      if (safe_shelter && safe_shelter.coordinates) {
        const shelterIconHtml = `
          <div class="w-6 h-6 rounded-lg bg-sky-600 border border-white text-white flex items-center justify-center shadow-lg cursor-pointer" title="Safe Evacuation Shelter">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        `;
        const shelterIcon = L.divIcon({
          html: shelterIconHtml,
          className: 'custom-shelter-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const shelterMarker = L.marker(safe_shelter.coordinates, { icon: shelterIcon }).addTo(map);
        shelterMarker.bindPopup(`
          <div class="p-1 text-xs">
            <div class="font-bold text-sky-400">🛡️ Safe Evacuation Zone</div>
            <div class="text-white font-semibold text-xs mt-0.5">${safe_shelter.name}</div>
            <div class="text-slate-300 font-mono text-[11px] mt-1">
              Elevation: ${safe_shelter.elevation_m}m (+${safe_shelter.elevation_m - elevation_m}m above valley)<br/>
              Capacity: ${safe_shelter.capacity.toLocaleString()} persons
            </div>
          </div>
        `);
        shelterMarkersRef.current.push(shelterMarker);
      }
    });
  }, [villages, selectedVillage]);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      
      {/* Map Header / Legend */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">
            Himalayan Catchment Geospatial View (Alaknanda Basin)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-400">Low (&lt;35%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
            <span className="text-slate-400">Med</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span className="text-slate-400">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span className="text-slate-400 font-bold">Critical (&gt;78%)</span>
          </div>
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
            <span className="w-3 h-1 bg-sky-500 inline-block"></span>
            <span className="text-slate-400">River Choke Line</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sky-400 font-bold">🛡️</span>
            <span className="text-slate-400">Safe Shelters</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Help tooltip on map */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-[11px] text-slate-300 px-2.5 py-1.5 rounded-lg shadow-md pointer-events-none flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-sky-400" />
          <span>Click any village marker to inspect AI feature weights & LoRa stream</span>
        </div>
      </div>

    </div>
  );
}
