'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  Car,
  User,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { BookingStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusTab !== 'ALL') params.append('status', statusTab);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const tabs = [
    { id: 'ALL', label: 'All Bookings' },
    { id: 'ACTIVE_RENTAL', label: 'Active Rentals' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'OVERDUE', label: 'Overdue' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bookings & Rentals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end rental lifecycle: check-out inspections, return processing, agreements, and billing.
          </p>
        </div>

        <Link
          href="/dashboard/bookings/new"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 shrink-0 ${
              statusTab === tab.id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking number (e.g. RR-BK-...) or customer name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No bookings found matching current status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Reserved Vehicle</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link href={`/dashboard/bookings/${b.id}`} className="hover:text-emerald-600 block">
                        {b.bookingNumber}
                      </Link>
                      <span className="text-[10px] text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400">{b.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{b.vehicleBrand} {b.vehicleModel}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.vehicleReg}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="font-medium">{new Date(b.pickupDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400">to {new Date(b.returnDate).toLocaleDateString()}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{b.days} d</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatINR(b.totalAmount)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${b.balanceAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {formatINR(b.balanceAmount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/bookings/${b.id}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition"
                        >
                          Manage
                        </Link>
                        <Link
                          href={`/dashboard/bookings/${b.id}/agreement`}
                          target="_blank"
                          title="Print Rental Agreement"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
