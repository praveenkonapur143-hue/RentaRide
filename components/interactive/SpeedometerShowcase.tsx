'use client';

import React, { useState, useEffect } from 'react';
import { Gauge, Zap, Flame, Compass, Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';

interface DriveMode {
  id: 'ECO' | 'SPORT' | 'OFFROAD';
  name: string;
  tagline: string;
  badgeColor: string;
  speed: number;
  rpm: number;
  gear: string;
  mileage: string;
  recommendedCar: string;
  accentHex: string;
  gradientClass: string;
}

const DRIVE_MODES: DriveMode[] = [
  {
    id: 'ECO',
    name: 'Eco Commuter',
    tagline: 'Max fuel efficiency in city peak hour traffic',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    speed: 48,
    rpm: 1850,
    gear: 'D4',
    mileage: '24.8 km/litre',
    recommendedCar: 'Maruti Swift / Baleno / Tiago EV',
    accentHex: '#10B981',
    gradientClass: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'SPORT',
    name: 'Expressway Sport',
    tagline: 'High-speed stability & rapid overtakes on NH44 / Samruddhi',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    speed: 110,
    rpm: 3600,
    gear: 'S6',
    mileage: '16.4 km/litre',
    recommendedCar: 'VW Virtus GT / Hyundai Creta Turbo / Honda City',
    accentHex: '#F59E0B',
    gradientClass: 'from-amber-500 to-rose-500'
  },
  {
    id: 'OFFROAD',
    name: '4x4 Trail Crawl',
    tagline: 'Maximum low-end torque for Western Ghats, Spiti & Coorg slopes',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    speed: 32,
    rpm: 2400,
    gear: '4L',
    mileage: '12.8 km/litre',
    recommendedCar: 'Mahindra Thar 4x4 / Scorpio-N / Fortuner 4WD',
    accentHex: '#06B6D4',
    gradientClass: 'from-cyan-500 to-blue-600'
  }
];

export default function SpeedometerShowcase() {
  const [activeMode, setActiveMode] = useState<DriveMode>(DRIVE_MODES[0]);
  const [displaySpeed, setDisplaySpeed] = useState(DRIVE_MODES[0].speed);
  const [displayRpm, setDisplayRpm] = useState(DRIVE_MODES[0].rpm);
  const [isRevving, setIsRevving] = useState(false);

  // Smooth needle transition when mode changes
  useEffect(() => {
    let startSpeed = displaySpeed;
    let targetSpeed = activeMode.speed;
    let startRpm = displayRpm;
    let targetRpm = activeMode.rpm;
    let frame = 0;
    const totalFrames = 20;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplaySpeed(Math.round(startSpeed + (targetSpeed - startSpeed) * ease));
      setDisplayRpm(Math.round(startRpm + (targetRpm - startRpm) * ease));
      if (frame >= totalFrames) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [activeMode]);

  // Temporary throttle rev animation
  const handleRevThrottle = () => {
    setIsRevving(true);
    const boostedSpeed = Math.min(activeMode.speed + 35, 140);
    const boostedRpm = Math.min(activeMode.rpm + 2200, 6200);
    setDisplaySpeed(boostedSpeed);
    setDisplayRpm(boostedRpm);

    setTimeout(() => {
      setDisplaySpeed(activeMode.speed);
      setDisplayRpm(activeMode.rpm);
      setIsRevving(false);
    }, 1200);
  };

  // Speedometer needle angle: -120 deg (0 km/h) to +120 deg (160 km/h)
  const maxSpeed = 160;
  const needleAngle = -120 + (displaySpeed / maxSpeed) * 240;

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Dynamic ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: activeMode.accentHex }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automotive Telemetry Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tuned for Indian Roads & High-Torque Getaways
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Every vehicle in the RentaRide fleet is speed-governed to MoRTH compliance (80-110 km/h) with real-time OBD-II health diagnostics.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {DRIVE_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2.5 border ${
                activeMode.id === mode.id
                  ? 'bg-slate-900 text-white border-slate-700 shadow-xl shadow-black/40 scale-105'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: mode.accentHex }}
              />
              <span>{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Left: SVG Circular Gauge */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg viewBox="0 0 240 240" className="w-full h-full transform">
                {/* Background arc track */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="16"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                  strokeLinecap="round"
                  transform="rotate(135 120 120)"
                />

                {/* Active speed gradient arc */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke={activeMode.accentHex}
                  strokeWidth="16"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (displaySpeed / maxSpeed) * 330}
                  strokeLinecap="round"
                  transform="rotate(135 120 120)"
                  className="transition-all duration-300"
                />

                {/* Dial Tick marks */}
                {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((speedVal, idx) => {
                  const angle = -120 + (speedVal / maxSpeed) * 240;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 120 + 78 * Math.cos(rad);
                  const y1 = 120 + 78 * Math.sin(rad);
                  const x2 = 120 + 88 * Math.cos(rad);
                  const y2 = 120 + 88 * Math.sin(rad);
                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Needle */}
                <g transform={`rotate(${needleAngle} 120 120)`} className="transition-transform duration-300">
                  <line
                    x1="120"
                    y1="120"
                    x2="120"
                    y2="36"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="120" cy="120" r="10" fill="#FFFFFF" />
                  <circle cx="120" cy="120" r="5" fill={activeMode.accentHex} />
                </g>
              </svg>

              {/* Digital Speed Display Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter">
                  {displaySpeed}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 -mt-1">
                  KM / H
                </span>
                <span
                  className="mt-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700"
                  style={{ color: activeMode.accentHex }}
                >
                  {displayRpm} RPM • {activeMode.gear}
                </span>
              </div>
            </div>

            {/* Rev Throttle Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleRevThrottle}
                disabled={isRevving}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-white transition flex items-center gap-2 active:scale-95 shadow-md"
              >
                <Flame className={`w-4 h-4 ${isRevving ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
                <span>{isRevving ? 'Revving RPM...' : 'Tap to Rev Throttle'}</span>
              </button>
            </div>
          </div>

          {/* Right: Mode Specs & Car Match */}
          <div className="lg:col-span-6 space-y-6 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${activeMode.badgeColor}`}>
                {activeMode.name} Profile
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                {activeMode.tagline}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Certified Mileage</p>
                <p className="text-xl font-black text-white mt-0.5" style={{ color: activeMode.accentHex }}>
                  {activeMode.mileage}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Cruise Gear Ratio</p>
                <p className="text-xl font-black text-white mt-0.5">
                  {activeMode.gear} Active
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Recommended Fleet Match</h4>
                <p className="text-sm font-black text-emerald-300 mt-0.5">{activeMode.recommendedCar}</p>
                <p className="text-xs text-slate-400 mt-1">100% sanitized, pre-loaded FASTag card, insured under Motor Vehicles Act.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>MoRTH certified AIS-140 GPS telematics & automatic speed alerting enabled.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
