'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Key, Calendar, User, LayoutDashboard } from 'lucide-react';

export function MobileAppDock() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Don't show dock inside print layouts or agreement printable views
  if (pathname.includes('/agreement')) {
    return null;
  }

  const isHome = pathname === '/' || pathname === '/#vehicles';
  const isBooking = pathname.startsWith('/dashboard/bookings/new');
  const isAccount = pathname.startsWith('/my-account');
  const isDashboard = pathname.startsWith('/dashboard') && !isBooking;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      <div className="grid grid-cols-4 items-center h-16 px-2 max-w-md mx-auto">
        {/* Tab 1: Explore Fleet */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-90 ${
            isHome ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Car className="w-5 h-5" />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Fleet</span>
        </Link>

        {/* Tab 2: Book / Reserve (Elevated Center CTA) */}
        <Link
          href="/dashboard/bookings/new"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 ${
              isBooking
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/40 ring-4 ring-slate-950'
                : 'bg-emerald-600 text-white shadow-emerald-600/30 group-hover:scale-105'
            }`}
          >
            <Key className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-extrabold mt-1 tracking-tight ${
              isBooking ? 'text-emerald-400' : 'text-slate-300'
            }`}
          >
            Rent Car
          </span>
        </Link>

        {/* Tab 3: My Trips / Bookings */}
        <Link
          href="/my-account"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-90 ${
            isAccount ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5" />
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">My Trips</span>
        </Link>

        {/* Tab 4: Account or Operations Portal */}
        {user?.role === 'ADMIN' || user?.role === 'STAFF' ? (
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-90 ${
              isDashboard ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className="w-5 h-5" />
              {isDashboard && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Fleet Ops</span>
          </Link>
        ) : (
          <Link
            href={user ? '/my-account' : '/user/login'}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-90 ${
              isAccount && !isHome && !isBooking
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
