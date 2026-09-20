'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Car, Shield, PhoneCall } from 'lucide-react';

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition transform">
            Z
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Renta<span className="text-emerald-600">Ride</span>
            </span>
            <span className="block text-[11px] font-bold text-emerald-700 -mt-1 tracking-wide">
              Self-Drive India • Zoom Experience
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/#vehicles" className="hover:text-emerald-600 transition">
            Cars & 4x4
          </Link>
          <Link href="/#how-it-works" className="hover:text-emerald-600 transition">
            How It Works
          </Link>
          <Link href="/#benefits" className="hover:text-emerald-600 transition">
            Zoom Advantage
          </Link>
          <Link href="/#testimonials" className="hover:text-emerald-600 transition">
            Reviews
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            Host / Staff Portal
          </Link>
          <Link
            href="/dashboard/bookings/new"
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition active:scale-95"
          >
            Book Self-Drive
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="#vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Fleet & Categories
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            How It Works
          </Link>
          <Link
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Why RentaRide
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
            >
              Staff Portal
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow"
            >
              Book a Vehicle
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
