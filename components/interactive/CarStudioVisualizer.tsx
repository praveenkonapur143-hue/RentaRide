'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Gauge,
  Compass,
  Volume2,
  VolumeX,
  ShieldCheck,
  Zap,
  Luggage,
  CheckCircle,
  Eye,
  Sliders,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface StudioCar {
  id: string;
  brand: string;
  model: string;
  category: string;
  badge: string;
  dailyPrice: number;
  hourlyRate: number;
  engine: string;
  power: string;
  torque: string;
  clearance: string;
  luggage: string;
  audioSystem: string;
  safetyScore: string;
  colors: { name: string; hex: string; filterClass?: string }[];
  views: {
    label: string;
    description: string;
    imageUrl: string;
  }[];
}

const STUDIO_CARS: StudioCar[] = [
  {
    id: 'veh-03',
    brand: 'Mahindra',
    model: 'Thar LX Hard Top 4x4',
    category: 'SUV & 4x4',
    badge: 'Goa & Mountain Legend',
    dailyPrice: 4500,
    hourlyRate: 190,
    engine: '2.2L mHawk Turbo Diesel',
    power: '130 BHP',
    torque: '300 Nm @ 1600-2800 RPM',
    clearance: '226 mm Ground Clearance',
    luggage: '2 Cabin Bags + Adventure Tents',
    audioSystem: 'Roof-Mounted Water-Resistant Speakers',
    safetyScore: '4-Star Global NCAP',
    colors: [
      { name: 'Napoli Black', hex: '#1C1917' },
      { name: 'Rocky Beige', hex: '#A89F91' },
      { name: 'Red Rage', hex: '#991B1B' },
      { name: 'Aquamarine', hex: '#0E7490' },
    ],
    views: [
      {
        label: 'Front 3/4 Stance',
        description: 'Iconic vertical-slat grille with round retro headlamps and flared wheel arches.',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000'
      },
      {
        label: 'Cockpit View',
        description: 'Drizzle-resistant IP54 rated dashboard with real-time pitch & roll angle gauges.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000'
      },
      {
        label: 'Trail Offroad',
        description: 'Shift-on-the-fly mechanical 4WD transfer case with 4L crawl gear ratio.',
        imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1000'
      }
    ]
  },
  {
    id: 'veh-09',
    brand: 'Toyota',
    model: 'Fortuner Legender 4x4',
    category: 'SUV & 4x4',
    badge: 'VIP Highway Dominator',
    dailyPrice: 8500,
    hourlyRate: 350,
    engine: '2.8L Turbo Diesel D-4D',
    power: '204 BHP',
    torque: '500 Nm Torque Beast',
    clearance: '221 mm Rough Road Stance',
    luggage: '4 Large Suitcases + 2 Duffle Bags',
    audioSystem: 'JBL 11-Speaker 3D Surround',
    safetyScore: '5-Star ASEAN NCAP',
    colors: [
      { name: 'Pearl White Dual-Tone', hex: '#F8FAFC' },
      { name: 'Attitude Black', hex: '#09090B' },
      { name: 'Phantom Brown', hex: '#451A03' }
    ],
    views: [
      {
        label: 'Front 3/4 Stance',
        description: 'Catamaran-style aerodynamic front bumper with sequential LED turn lamps.',
        imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000'
      },
      {
        label: 'Executive Cabin',
        description: 'Perforated maroon-black dual tone leather seats with wireless inductive charging.',
        imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000'
      },
      {
        label: 'Highway Presence',
        description: 'Massive 18-inch multi-spoke precision cut alloys and illuminated scuff plates.',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000'
      }
    ]
  },
  {
    id: 'veh-02',
    brand: 'Hyundai',
    model: 'Creta SX (O) Turbo',
    category: 'Compact SUV',
    badge: 'India’s #1 Urban SUV',
    dailyPrice: 3400,
    hourlyRate: 140,
    engine: '1.5L U2 CRDi Diesel AT',
    power: '116 BHP',
    torque: '250 Nm Smooth Pull',
    clearance: '190 mm Speedbreaker Proof',
    luggage: '3 Large Bags (433 Litres Boot)',
    audioSystem: 'Bose 8-Speaker Premium Acoustics',
    safetyScore: 'Level 2 SmartSense ADAS',
    colors: [
      { name: 'Atlas White', hex: '#F1F5F9' },
      { name: 'Titan Grey Matte', hex: '#475569' },
      { name: 'Abyss Black', hex: '#0F172A' },
      { name: 'Ranger Khaki', hex: '#57534E' },
    ],
    views: [
      {
        label: 'Front 3/4 Stance',
        description: 'Parametric dark chrome radiator grille with connecting horizon LED lightbar.',
        imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1000'
      },
      {
        label: 'Panoramic Cockpit',
        description: 'Dual 10.25-inch infotainment with ventilated cooling seats and voice sunroof.',
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000'
      },
      {
        label: 'Night LED Stance',
        description: 'Connected LED tail lamps with integrated high-mount stop light spoiler.',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000'
      }
    ]
  },
  {
    id: 'veh-11',
    brand: 'Volkswagen',
    model: 'Virtus GT Plus DSG',
    category: 'Sedan',
    badge: 'German Turbo Precision',
    dailyPrice: 3300,
    hourlyRate: 135,
    engine: '1.5L TSI EVO 4-Cylinder',
    power: '150 BHP Pure German Muscle',
    torque: '250 Nm @ 1600-4300 RPM',
    clearance: '179 mm Segment-Best Clearance',
    luggage: '521 Litres Cavernous Boot',
    audioSystem: '8-Speaker High-Fidelity DSP',
    safetyScore: '5-Star Global NCAP (Adult & Child)',
    colors: [
      { name: 'Wild Cherry Red', hex: '#B91C1C' },
      { name: 'Carbon Steel Grey', hex: '#334155' },
      { name: 'Candy White', hex: '#FAFAFA' },
      { name: 'Lava Blue', hex: '#1E3A8A' }
    ],
    views: [
      {
        label: 'Front 3/4 Stance',
        description: 'GT badged honeycomb air dams with smoked LED headlights and red brake calipers.',
        imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1000'
      },
      {
        label: 'Virtual Cockpit',
        description: '10-inch digital cockpit with paddle shifters and cylinder-deactivation tech display.',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000'
      },
      {
        label: 'Rear Stance',
        description: 'Gloss black boot-lid spoiler with dual-tone bumper diffuser and shark-fin antenna.',
        imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000'
      }
    ]
  },
  {
    id: 'veh-01',
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi+ Dual Jet',
    category: 'Hatchback',
    badge: 'India’s Agile City King',
    dailyPrice: 1800,
    hourlyRate: 75,
    engine: '1.2L Z-Series Dual VVT',
    power: '82 BHP Peppy Drive',
    torque: '112 Nm Ultra Responsive',
    clearance: '163 mm Easy Turning Radius',
    luggage: '265 Litres Everyday Boot',
    audioSystem: 'Arkamys Surround Sound System',
    safetyScore: '6 Airbags Standard + ESP',
    colors: [
      { name: 'Sizzling Red', hex: '#DC2626' },
      { name: 'Luster Blue', hex: '#2563EB' },
      { name: 'Arctic White', hex: '#F8FAFC' },
      { name: 'Magma Grey', hex: '#4B5563' }
    ],
    views: [
      {
        label: 'Front 3/4 Stance',
        description: 'Floating roof design with wraparound precision cut alloys and LED DRLs.',
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000'
      },
      {
        label: 'Driver Cockpit',
        description: 'Driver-centric center console with SmartPlay Pro+ and automatic climate control.',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000'
      },
      {
        label: 'Side Profile',
        description: 'Compact 3.86m footprint easy to zip through Delhi, Bengaluru & Mumbai traffic.',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000'
      }
    ]
  }
];

interface CarStudioVisualizerProps {
  onQuickCheckout?: (vehicleId: string) => void;
}

export default function CarStudioVisualizer({ onQuickCheckout }: CarStudioVisualizerProps) {
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [selectedViewIndex, setSelectedViewIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const car = STUDIO_CARS[selectedCarIndex];
  const currentView = car.views[selectedViewIndex] || car.views[0];
  const currentColor = car.colors[selectedColorIndex] || car.colors[0];

  const handleToggleSound = () => {
    setSoundPlaying(!soundPlaying);
    // Auto turn off sound after 4 seconds
    if (!soundPlaying) {
      setTimeout(() => setSoundPlaying(false), 4000);
    }
  };

  return (
    <section className="relative py-20 bg-slate-950 text-white overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentColor.hex }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Anti-AI Craft Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 360° Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Inspect Every Curve. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Before You Turn The Key.
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Switch angles, test real exterior finishes, review verified dyno specs, and preview your ride’s real-world cockpit before booking.
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {STUDIO_CARS.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCarIndex(idx);
                  setSelectedViewIndex(0);
                  setSelectedColorIndex(0);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  selectedCarIndex === idx
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{c.model.split(' ')[0]}</span>
                {selectedCarIndex === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Stage Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-center">
          {/* Main Visualizer Stage (Left 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Viewport Card */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl group">
              {/* Dynamic Vehicle Image */}
              <img
                key={`${car.id}-${selectedViewIndex}`}
                src={currentView.imageUrl}
                alt={`${car.brand} ${car.model} - ${currentView.label}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Top Bar on Stage */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-emerald-400 text-xs font-extrabold tracking-wide uppercase">
                    {car.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono">
                    {car.safetyScore}
                  </span>
                </div>

                {/* Acoustic Sound Rev Simulator */}
                <button
                  onClick={handleToggleSound}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition flex items-center gap-2 ${
                    soundPlaying
                      ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                      : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                  title="Simulate acoustic exhaust note"
                >
                  {soundPlaying ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                      <span>Revving 3,800 RPM...</span>
                      {/* Audio frequency wave visualizer */}
                      <span className="flex items-end gap-0.5 h-3 ml-1">
                        <span className="w-0.5 h-2 bg-white animate-ping" />
                        <span className="w-0.5 h-3 bg-white animate-pulse" />
                        <span className="w-0.5 h-1.5 bg-white animate-ping" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen to Engine Note</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Angle Overlay Information */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{car.brand} {car.model}</h3>
                    <span className="text-xs text-slate-400 font-mono">({currentColor.name})</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-md line-clamp-2">
                    {currentView.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right mr-1">
                    <p className="text-lg font-black text-white">{formatINR(car.dailyPrice)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">₹{car.hourlyRate}/hr • Unlimited km opt.</p>
                  </div>

                  {onQuickCheckout ? (
                    <button
                      onClick={() => onQuickCheckout(car.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                    >
                      <span>Reserve Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/bookings/new?vehicleId=${car.id}`}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                    >
                      <span>Reserve Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* View Selector Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {car.views.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedViewIndex(idx)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedViewIndex === idx
                      ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>{v.label}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {v.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls & Telemetry Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Color Palette Switcher */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Factory Paint Finish</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {currentColor.name}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {car.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`relative w-10 h-10 rounded-full transition-transform duration-200 flex items-center justify-center ${
                      selectedColorIndex === idx
                        ? 'scale-110 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColorIndex === idx && (
                      <CheckCircle className={`w-4 h-4 ${c.hex === '#FAFAFA' || c.hex === '#F8FAFC' || c.hex === '#F1F5F9' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyno Specs & Live Telemetry Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span>Verified Dyno & Trail Specs</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  TESTED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Engine & Power */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Powertrain</span>
                  <span className="font-extrabold text-white text-right">{car.engine}</span>
                </div>

                {/* Power Output */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Max Output</span>
                  <span className="font-extrabold text-emerald-400">{car.power}</span>
                </div>

                {/* Torque Output */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Peak Torque</span>
                  <span className="font-extrabold text-white">{car.torque}</span>
                </div>

                {/* Ground Clearance */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Ground Clearance</span>
                  <span className="font-extrabold text-cyan-300">{car.clearance}</span>
                </div>

                {/* Luggage Simulator */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>Boot Capacity</span>
                  </span>
                  <span className="font-semibold text-slate-200 text-right">{car.luggage}</span>
                </div>

                {/* Audio System */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Audio Stage</span>
                  <span className="font-semibold text-slate-200 text-right">{car.audioSystem}</span>
                </div>
              </div>
            </div>

            {/* Zero Friction Fast Guarantee */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="leading-snug">
                <strong>100% Sanitized & Pre-Inspected:</strong> Inspected across 40 physical points prior to your pickup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
