'use client';

import React from 'react';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

const LIVE_DISPATCHES = [
  {
    icon: '🚗',
    driver: 'Rahul V.',
    car: 'Mahindra Thar 4x4',
    city: 'Goa (Dabolim Airport)',
    time: '2 mins ago',
    tag: 'Mountain / Offroad'
  },
  {
    icon: '⚡',
    driver: 'Ananya S.',
    car: 'Tata Tiago EV',
    city: 'Bengaluru (Indiranagar Hub)',
    time: '6 mins ago',
    tag: 'Green Eco Commute'
  },
  {
    icon: '🚙',
    driver: 'Vikram M.',
    car: 'Toyota Fortuner Legender',
    city: 'Delhi NCR (IGI Airport T3)',
    time: '11 mins ago',
    tag: 'Highway VIP'
  },
  {
    icon: '🏔️',
    driver: 'Pooja K.',
    car: 'Hyundai Creta SX (O)',
    city: 'Gurugram ➔ Manali',
    time: '18 mins ago',
    tag: 'Family Road Trip'
  },
  {
    icon: '💼',
    driver: 'Sameer T.',
    car: 'Honda City ZX',
    city: 'Mumbai (BKC Hub)',
    time: '25 mins ago',
    tag: 'Corporate Self-Drive'
  },
  {
    icon: '🏞️',
    driver: 'Arjun N.',
    car: 'Toyota Innova Crysta 7-Str',
    city: 'Pune ➔ Mahabaleshwar',
    time: '34 mins ago',
    tag: '7-Passenger Tour'
  },
  {
    icon: '🏎️',
    driver: 'Kunal P.',
    car: 'VW Virtus GT DSG',
    city: 'Hyderabad (Hitec City Hub)',
    time: '41 mins ago',
    tag: 'Turbo Highway'
  },
];

export default function RoadTripTicker() {
  return (
    <div className="w-full bg-slate-950 border-b border-emerald-900/40 text-white overflow-hidden py-2.5 relative z-30 select-none">
      {/* Subtle glowing side fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        {/* Static badge on the left */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 ml-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Live Radar</span>
        </div>

        {/* Ticker marquee */}
        <div className="overflow-hidden flex-1 ml-3">
          <div className="animate-marquee flex items-center gap-8 text-xs">
            {/* Duplicated list for infinite seamless loop */}
            {[...LIVE_DISPATCHES, ...LIVE_DISPATCHES].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 shrink-0 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-emerald-500/40 transition cursor-default group"
              >
                <span className="text-sm group-hover:scale-125 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="font-bold text-white tracking-tight">
                  {item.driver}
                </span>
                <span className="text-slate-400 font-medium">
                  unlocked <span className="text-emerald-400 font-semibold">{item.car}</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  in {item.city}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
