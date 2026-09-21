'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Car, Shield, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export function PublicNav() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: 'ADMIN' | 'STAFF' | 'CUSTOMER' } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition transform">
            R
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Renta<span className="text-emerald-600">Ride</span>
            </span>
            <span className="block text-[11px] font-bold text-emerald-700 -mt-1 tracking-wide">
              Self-Drive India • Zero Security Deposit
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
            RentaRide Advantage
          </Link>
          <Link href="/#testimonials" className="hover:text-emerald-600 transition">
            Reviews
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === 'CUSTOMER' ? (
                <Link
                  href="/my-account"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <span>My Trips ({user.name.split(' ')[0]})</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Operations ({user.role})</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard/bookings/new"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition active:scale-95"
              >
                Book Self-Drive
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/user/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/user/register"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Staff Portal
              </Link>
              <Link
                href="/dashboard/bookings/new"
                className="ml-1 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition active:scale-95"
              >
                Book Self-Drive
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Link
              href={user.role === 'CUSTOMER' ? '/my-account' : '/dashboard'}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200"
            >
              {user.name.split(' ')[0]}
            </Link>
          )}
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
            href="/#vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Fleet & Categories
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            How It Works
          </Link>
          <Link
            href="/#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Why RentaRide
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={user.role === 'CUSTOMER' ? '/my-account' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {user.role === 'CUSTOMER' ? 'My Trips & Profile' : 'Operations Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-center py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/user/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/user/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200"
                  >
                    Register
                  </Link>
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50"
                >
                  Staff / Fleet Operations Portal
                </Link>
              </>
            )}

            <Link
              href="/dashboard/bookings/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow"
            >
              Book a Vehicle
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
