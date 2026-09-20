'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Key, CheckCircle, Lock, Unlock, Sparkles, Navigation, Clock } from 'lucide-react';

export default function ContactlessTripSteps() {
  const [unlocked, setUnlocked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleToggleLock = () => {
    setAnimating(true);
    setTimeout(() => {
      setUnlocked(!unlocked);
      setAnimating(false);
    }, 600);
  };

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Effortless 3-Step Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Renting Works in 3 Simple Taps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            No paper forms. No tedious security deposit queues. Book online, walk up to your car, and drive.
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl shadow-sm mb-6">
                01
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Choose Car & Hub
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick from real Indian cars—Swift, Thar, Innova Crysta, or Baleno. Choose free airport pickup or doorstep delivery to your home or hotel.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Navigation className="w-4 h-4" />
              <span>Available in 8+ Metro Cities</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl shadow-sm mb-6">
                02
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Quick 2-Min KYC
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your driving licence and verify Aadhaar via DigiLocker. Zero security deposit required on verified profiles.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-700">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Encrypted & MoRTH Compliant</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-2xl shadow-sm mb-6">
                03
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Unlock via Phone & Drive
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Locate your sanitized car via GPS, tap your phone to unlock doors wirelessly, grab keys from the glovebox, and start driving.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-amber-700">
              <Key className="w-4 h-4" />
              <span>FASTag Pre-loaded for Highways</span>
            </div>
          </div>
        </div>

        {/* Interactive Phone Keyless Unlock Simulation Widget */}
        <div className="mt-12 bg-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Interactive Live Demo</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Try The Keyless Bluetooth Unlock
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Experience how seamless your pickup is. When you reach the parking bay at BLR Airport or Delhi T3, tap below to simulate remote car access:
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={handleToggleLock}
                  disabled={animating}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-3 shadow-lg active:scale-95 ${
                    unlocked
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {animating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Bluetooth Beacon...</span>
                    </>
                  ) : unlocked ? (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Lock Vehicle (Engine Off)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      <span>Tap to Unlock Car via Phone</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-slate-400 font-mono">
                  Bay: <strong className="text-white">P2-B44 (Kempegowda T1)</strong>
                </div>
              </div>
            </div>

            {/* Right: Visual Car Status Indicator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 mb-4 shadow-xl ${
                    unlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 scale-110 shadow-emerald-500/20'
                      : 'bg-rose-500/20 text-rose-400 border-2 border-rose-400 shadow-rose-500/20'
                  }`}
                >
                  {unlocked ? <Unlock className="w-10 h-10 animate-pulse" /> : <Lock className="w-10 h-10" />}
                </div>

                <h4 className="text-base font-black text-white">
                  {unlocked ? 'Vehicle Unlocked & Ready!' : 'Vehicle Armed & Locked'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {unlocked
                    ? 'Hazard lights flashed twice. Doors open. Glovebox key tray released.'
                    : 'Awaiting proximity beacon signal from your authorized phone.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 w-full flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Battery: 98%</span>
                  <span>FASTag: ₹500 Bal</span>
                  <span className="text-emerald-400">GPS: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
