'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Radio,
  Sparkles,
  Car,
  Key,
  ShieldCheck,
  CheckCircle,
  Navigation,
  ArrowUpRight
} from 'lucide-react';

interface HubStation {
  id: string;
  city: string;
  stationName: string;
  type: 'AIRPORT' | 'METRO' | 'COMMERCIAL';
  carsAvailable: number;
  featuredCar: string;
  fastDispatchMins: number;
  address: string;
  landmark: string;
  hasFastag: boolean;
}

const HUBS: HubStation[] = [
  {
    id: 'hub-blr-air',
    city: 'Bengaluru',
    stationName: 'Kempegowda Airport (BLR) T1 & T2',
    type: 'AIRPORT',
    carsAvailable: 14,
    featuredCar: 'Mahindra Thar 4x4 & Innova Crysta',
    fastDispatchMins: 15,
    address: 'Dedicated Parking Bay 4, Terminal 1 Commercial Hub',
    landmark: 'Direct walkway from baggage claim exit',
    hasFastag: true
  },
  {
    id: 'hub-blr-indi',
    city: 'Bengaluru',
    stationName: 'Indiranagar 100ft Road Hub',
    type: 'METRO',
    carsAvailable: 8,
    featuredCar: 'Maruti Swift & Tata Tiago EV',
    fastDispatchMins: 20,
    address: 'Opposite CMH Road Metro Pillar 124',
    landmark: '2 mins walk from Indiranagar Metro Station',
    hasFastag: true
  },
  {
    id: 'hub-del-t3',
    city: 'Delhi NCR',
    stationName: 'IGI International Airport Terminal 3',
    type: 'AIRPORT',
    carsAvailable: 19,
    featuredCar: 'Toyota Fortuner Legender & Creta',
    fastDispatchMins: 12,
    address: 'Multi-Level Car Parking (MLCP) Level 2, Pillar D12',
    landmark: 'Connected directly via T3 Aerocity Skybridge',
    hasFastag: true
  },
  {
    id: 'hub-ggn-cyber',
    city: 'Delhi NCR',
    stationName: 'DLF Cyber City Hub (Gurugram)',
    type: 'COMMERCIAL',
    carsAvailable: 11,
    featuredCar: 'Honda City ZX & VW Virtus GT',
    fastDispatchMins: 25,
    address: 'Building 10 Parking Basement 1, CyberHub',
    landmark: 'Rapid Metro Cyber City Station exit',
    hasFastag: true
  },
  {
    id: 'hub-bom-t2',
    city: 'Mumbai',
    stationName: 'CSMIA Airport Terminal 2 (Andheri East)',
    type: 'AIRPORT',
    carsAvailable: 16,
    featuredCar: 'Creta SX(O) & Mercedes E-Class',
    fastDispatchMins: 15,
    address: 'P4 Premium Mobility Zone, Sahar Road',
    landmark: 'Direct lift access from Arrivals Gate 4',
    hasFastag: true
  },
  {
    id: 'hub-goa-dab',
    city: 'Goa',
    stationName: 'Dabolim Airport Mobility Deck',
    type: 'AIRPORT',
    carsAvailable: 12,
    featuredCar: 'Mahindra Thar LX Hard Top 4x4',
    fastDispatchMins: 10,
    address: 'Arrivals Outer Ring Road, Bay 03',
    landmark: 'Immediately opposite Prepaid Taxi Counter',
    hasFastag: true
  }
];

interface LiveHubRadarProps {
  onSelectHubCity?: (city: string) => void;
}

export default function LiveHubRadar({ onSelectHubCity }: LiveHubRadarProps) {
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [activeHubId, setActiveHubId] = useState('hub-blr-air');

  const filteredHubs = selectedCity === 'ALL'
    ? HUBS
    : HUBS.filter(h => h.city === selectedCity);

  const activeHub = HUBS.find(h => h.id === activeHubId) || HUBS[0];

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Transit Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Airport & Metro Hubs. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Land, Tap, and Drive in 15 Minutes.
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Pre-parked, sanitized cars waiting at airport departure gates and central metro pillars across 8 major Indian transit networks.
            </p>
          </div>

          {/* City filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['ALL', 'Bengaluru', 'Delhi NCR', 'Mumbai', 'Goa'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCity === city
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {city === 'ALL' ? 'All Transit Hubs' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <div
              key={hub.id}
              onClick={() => {
                setActiveHubId(hub.id);
                if (onSelectHubCity) onSelectHubCity(hub.city);
              }}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between group ${
                activeHubId === hub.id
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/20">
                    {hub.type} HUB
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>{hub.carsAvailable} Cars Live</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-emerald-400 transition">
                  {hub.stationName}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{hub.address}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium italic">
                  Tip: {hub.landmark}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Fast Dispatch</span>
                  <span className="font-extrabold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>~{hub.fastDispatchMins} mins</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Top Fleet</span>
                  <span className="font-bold text-slate-300 truncate max-w-[140px] block">
                    {hub.featuredCar}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
