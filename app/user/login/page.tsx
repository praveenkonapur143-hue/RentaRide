'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Car,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

function UserLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/my-account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('customer123');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'customer123' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || 'Demo login failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Demo login error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/25 group-hover:scale-105 transition transform">
            R
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight">
              Renta<span className="text-emerald-500">Ride</span>
            </span>
            <span className="block text-[11px] font-bold text-emerald-400 -mt-1 tracking-wide">
              Self-Drive India • Customer Sign In
            </span>
          </div>
        </Link>

        <h1 className="mt-6 text-center text-2xl sm:text-3xl font-black tracking-tight text-white">
          Welcome Back, Renter!
        </h1>
        <p className="mt-2 text-center text-xs text-slate-400 font-medium">
          Sign in to book vehicles, track ongoing trips, and manage your keyless unlock.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Instant 1-Click Demo Renter Login */}
        <div className="mb-5 bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              1-Click Demo Renter Login
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoCustomerLogin('aarav.sharma@example.in')}
              disabled={loading}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs shadow transition active:scale-95 text-left flex flex-col gap-0.5 group disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-100 font-bold group-hover:text-emerald-400 transition">Aarav Sharma</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </div>
              <span className="text-[10px] text-emerald-400 font-normal">Active Trip • DL Verified</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoCustomerLogin('priya.patel@example.in')}
              disabled={loading}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs shadow transition active:scale-95 text-left flex flex-col gap-0.5 group disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-100 font-bold group-hover:text-emerald-400 transition">Priya Patel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </div>
              <span className="text-[10px] text-teal-400 font-normal">Frequent Renter • Mumbai</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/90 py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-800 backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-emerald-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In as Renter'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* New to RentaRide / Register */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
            <div>
              <span>New to RentaRide? </span>
              <Link href="/user/register" className="font-bold text-emerald-400 hover:underline">
                Create free renter account
              </Link>
            </div>
            <div className="pt-1">
              <Link href="/login" className="text-slate-500 hover:text-slate-300 transition text-[11px]">
                Are you a Fleet Manager or Operations Staff? Click here →
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits reminder */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-300 block">₹0 Security Deposit</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <Car className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-300 block">100% Real Cars</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-300 block">DigiLocker KYC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <UserLoginContent />
    </Suspense>
  );
}
