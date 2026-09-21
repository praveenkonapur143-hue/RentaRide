'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound, Car, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'STAFF'>('CUSTOMER');
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
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      if (data.user?.role === 'CUSTOMER') {
        router.push('/my-account');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'CUSTOMER' | 'ADMIN' | 'STAFF') => {
    let demoEmail = 'aarav.sharma@example.in';
    let demoPassword = 'customer123';

    if (type === 'ADMIN') {
      demoEmail = 'admin@rentaride.com';
      demoPassword = 'admin123';
    } else if (type === 'STAFF') {
      demoEmail = 'staff@rentaride.com';
      demoPassword = 'staff123';
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user?.role === 'CUSTOMER') {
          router.push('/my-account');
        } else {
          router.push('/dashboard');
        }
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/25">
            R
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Renta<span className="text-emerald-600">Ride</span>
            </span>
          </div>
        </Link>

        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {activeTab === 'CUSTOMER' ? 'Renter Sign In' : 'Fleet & Operations Portal'}
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500 font-medium">
          “Never Stop Living. Self-Drive Cars Across India.”
        </p>

        {/* Tab Switcher: Customer vs Staff */}
        <div className="mt-6 bg-slate-200/80 p-1 rounded-2xl flex max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('CUSTOMER'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'CUSTOMER'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer Renter</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('STAFF'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'STAFF'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>Staff & Admin</span>
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Login Cards depending on active tab */}
        {activeTab === 'CUSTOMER' ? (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Instant Renter Demo Access (1-Click Login):</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('CUSTOMER')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 text-center flex flex-col items-center disabled:opacity-50"
              >
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Aarav Sharma</span>
                <span className="text-[10px] text-emerald-200 font-normal">Active Trip • DL Verified</span>
              </button>

              <Link
                href="/user/register"
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition active:scale-95 text-center flex flex-col items-center justify-center"
              >
                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-emerald-400" /> New Renter</span>
                <span className="text-[10px] text-emerald-300 font-normal">Register with DL</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300/80 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
              <KeyRound className="w-4 h-4 text-slate-700" />
              <span>Staff Demo Access (1-Click Login):</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition active:scale-95 text-center flex flex-col items-center disabled:opacity-50"
              >
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Rajesh Menon</span>
                <span className="text-[10px] text-emerald-300 font-normal">Admin (Full Control)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('STAFF')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition active:scale-95 text-center flex flex-col items-center disabled:opacity-50"
              >
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Sunita Rao</span>
                <span className="text-[10px] opacity-90 font-normal">Staff (Fleet & KYC)</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'CUSTOMER' ? 'yourname@example.com' : 'name@company.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : activeTab === 'CUSTOMER' ? 'Sign In as Renter' : 'Sign In to Operations'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 space-y-2">
            {activeTab === 'CUSTOMER' ? (
              <div>
                <span>Don't have a renter account? </span>
                <Link href="/user/register" className="font-bold text-emerald-600 hover:underline">
                  Register as a renter
                </Link>
              </div>
            ) : (
              <div>
                <span>Need staff credentials? </span>
                <Link href="/register" className="font-bold text-emerald-600 hover:underline">
                  Create staff account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
