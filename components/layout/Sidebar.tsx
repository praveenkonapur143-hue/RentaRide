'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  ClipboardCheck,
  AlertTriangle,
  CreditCard,
  Wrench,
  BarChart3,
  Settings,
  Shield,
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole = 'ADMIN', isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet / Vehicles', href: '/dashboard/vehicles', icon: Car },
    { name: 'Bookings & Rentals', href: '/dashboard/bookings', icon: CalendarCheck },
    { name: 'Customers CRM', href: '/dashboard/customers', icon: Users },
    { name: 'Inspections', href: '/dashboard/inspections', icon: ClipboardCheck },
    { name: 'Damage Reports', href: '/dashboard/damages', icon: AlertTriangle },
    { name: 'Payments & Invoices', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Maintenance & Expiry', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Business Settings', href: '/dashboard/settings', icon: Settings, adminOnly: true },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
              R
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">RentaRide</span>
              <span className="block text-[10px] text-emerald-400 font-bold -mt-1 tracking-wider uppercase">Self-Drive Fleet</span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Role Pill */}
        <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800/80">
          <div className="flex items-center justify-between bg-slate-800/70 px-3.5 py-2 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">Role:</span>
            </div>
            <span
              className={clsx(
                'text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider',
                userRole === 'ADMIN'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              )}
            >
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 no-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            if (item.adminOnly && userRole !== 'ADMIN') return null;

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Public Link */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>
      </aside>
    </>
  );
}
