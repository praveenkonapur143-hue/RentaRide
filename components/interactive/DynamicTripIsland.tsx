'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface DynamicTripIslandProps {
  selectedVehicle?: {
    id: string;
    brand: string;
    model: string;
    dailyPrice: number;
    images?: { url: string }[];
  };
  city?: string;
  onOpenCheckout: () => void;
}

export default function DynamicTripIsland({
  selectedVehicle,
  city = 'Bengaluru',
  onOpenCheckout
}: DynamicTripIslandProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past 400px
      if (window.scrollY > 450 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || !selectedVehicle) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 transition-all duration-500 animate-float">
      <div className="bg-slate-950/90 border border-emerald-500/40 backdrop-blur-xl shadow-2xl rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-white">
        {/* Left: Thumbnail & Model */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
            <img
              src={selectedVehicle.images?.[0]?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200'}
              alt={selectedVehicle.model}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                {selectedVehicle.brand} {selectedVehicle.model}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{city} Transit Hub • FASTag Ready</span>
            </p>
          </div>
        </div>

        {/* Right: Price & Fast Checkout Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-medium">From</span>
            <span className="text-sm font-black text-emerald-400">
              {formatINR(selectedVehicle.dailyPrice)}/d
            </span>
          </div>

          <button
            onClick={onOpenCheckout}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
