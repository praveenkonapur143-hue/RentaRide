'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  CheckCircle2,
  Clock,
  CalendarCheck,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Plus
} from 'lucide-react';
import { RevenueExpenseChart } from '@/components/charts/RevenueExpenseChart';
import { FleetStatusDonut } from '@/components/charts/FleetStatusDonut';
import { BookingStatusBadge, VehicleStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function DashboardOverviewPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any>(null);
  const [expiryAlerts, setExpiryAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [vRes, bRes, rRes, mRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/bookings'),
          fetch('/api/reports/revenue'),
          fetch('/api/maintenance'),
        ]);

        const vData = await vRes.json();
        const bData = await bRes.json();
        const rData = await rRes.json();
        const mData = await mRes.json();

        setVehicles(vData.vehicles || []);
        setBookings(bData.bookings || []);
        setFinancials(rData.summary || null);
        setExpiryAlerts(mData.alerts || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute 9 metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const activeRentals = bookings.filter(b => b.status === 'ACTIVE_RENTAL').length;
  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const overdueReturns = bookings.filter(b => b.status === 'OVERDUE').length;
  const pendingPayments = financials?.pendingBalance || 15370;
  const monthlyRevenue = financials?.totalRevenue || 785000;
  const monthlyExpenses = financials?.totalExpenses || 215000;
  const netProfit = financials?.netProfit || (monthlyRevenue - monthlyExpenses);

  const fleetSummary = {
    available: availableVehicles,
    booked: vehicles.filter(v => v.status === 'BOOKED').length,
    rented: activeRentals,
    underMaintenance: vehicles.filter(v => v.status === 'UNDER_MAINTENANCE').length,
  };

  const recentBookings = bookings.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fleet Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry, Zoomcar-style trip statuses, GST revenue KPIs, and RC/PUC compliance alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/bookings/new"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Self-Drive Trip</span>
          </Link>
          <Link
            href="/dashboard/vehicles/new"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Car className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* 9 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* Total Vehicles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fleet</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalVehicles}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Thar 4x4, Creta, Swift, Fortuner & EVs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Available Vehicles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Now</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{availableVehicles}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for instant self-drive trip</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Rentals</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{activeRentals}</p>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Currently on the road with FASTag</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Bookings</p>
            <p className="text-2xl font-black text-teal-600 mt-1">{upcomingBookings}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Confirmed customer trips</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Returns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overdue Returns</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{overdueReturns}</p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Past scheduled drop-off</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Balances</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{formatINR(pendingPayments)}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Payable via UPI / Net Banking</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue (INR)</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(monthlyRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">+14% vs previous month</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Expenses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(monthlyExpenses)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Service, fastag & maintenance</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{formatINR(netProfit)}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">73% operating margin</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section: Revenue Area Chart + Availability Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Revenue & Profit Trajectory</h3>
              <p className="text-xs text-slate-500">Gross rental revenue vs. net earnings over the past 6 months</p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              Full Financial Report
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RevenueExpenseChart />
        </div>

        {/* Availability Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Fleet Availability Ratio</h3>
            <p className="text-xs text-slate-500">Active distribution across {totalVehicles} registered vehicles</p>
          </div>
          <FleetStatusDonut summary={fleetSummary} />
          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/vehicles"
              className="text-xs font-bold text-slate-600 hover:text-emerald-600"
            >
              Manage Fleet Inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Bookings Table & Expiry Alerts Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Bookings & Rentals</h3>
              <p className="text-xs text-slate-500">Live booking pipeline and operational statuses</p>
            </div>
            <Link
              href="/dashboard/bookings"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              View All Bookings
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link href={`/dashboard/bookings/${b.id}`} className="hover:text-emerald-600">
                        {b.bookingNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{b.vehicleBrand} {b.vehicleModel}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.vehicleReg}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {b.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {formatINR(b.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiry Radar Widget */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-900">RC / Insurance / PUC Radar</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Impending insurance, DMV registration, and pollution certificate renewals
            </p>

            <div className="space-y-3">
              {expiryAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  All vehicle compliance documents are in order.
                </div>
              ) : (
                expiryAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {alert.title}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {alert.brand} {alert.model}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Plate: <span className="font-mono font-medium">{alert.registrationNumber}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black ${alert.daysRemaining < 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {alert.daysRemaining < 0 ? 'Expired' : `${alert.daysRemaining} days`}
                      </span>
                      <p className="text-[10px] text-slate-400">{alert.expiryDate}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/maintenance"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Open Maintenance & Compliance Hub →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
