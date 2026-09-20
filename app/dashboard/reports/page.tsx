'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Car,
  Calendar,
  ArrowUpRight,
  PieChart as PieIcon
} from 'lucide-react';
import { RevenueExpenseChart } from '@/components/charts/RevenueExpenseChart';
import { initialVehicles, initialBookings, initialCustomers, initialPayments } from '@/lib/demo-data';
import { formatINR } from '@/lib/currency';

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [fleetStats, setFleetStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function loadReports() {
      try {
        const [revRes, utilRes] = await Promise.all([
          fetch('/api/reports/revenue'),
          fetch('/api/reports/fleet-utilization'),
        ]);

        const revData = await revRes.json();
        const utilData = await utilRes.json();

        setSummary(revData.summary || null);
        setFleetStats(utilData.vehicleStats || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  // CSV Export
  const exportBookingsCSV = () => {
    const headers = ['Booking Number', 'Customer ID', 'Vehicle ID', 'Pickup Date', 'Return Date', 'Days', 'Total Amount (₹)', 'Status'];
    const rows = initialBookings.map(b => [
      b.bookingNumber,
      b.customerId,
      b.vehicleId,
      b.pickupDate,
      b.returnDate,
      b.days,
      b.totalAmount,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rentaride_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStats = selectedCategory === 'ALL'
    ? fleetStats
    : fleetStats.filter(s => s.type === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Financial & Fleet Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revenue tracking, utilization metrics, operational margins, and downloadable audit reports.
          </p>
        </div>

        <button
          onClick={exportBookingsCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Bookings CSV</span>
        </button>
      </div>

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <p className="text-xl font-black text-slate-900 mt-1">{summary?.totalRevenue != null ? formatINR(summary.totalRevenue) : '₹7,85,000'}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Rental collections</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rental Income</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{summary?.rentalIncome != null ? formatINR(summary.rentalIncome) : '₹7,35,000'}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Excl. deposits</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</p>
          <p className="text-xl font-black text-slate-700 mt-1">{summary?.totalExpenses != null ? formatINR(summary.totalExpenses) : '₹2,15,000'}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Repairs + ops</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintenance</p>
          <p className="text-xl font-black text-amber-600 mt-1">{summary?.maintenanceCosts != null ? formatINR(summary.maintenanceCosts) : '₹95,000'}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Workshop logs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Refunds Issued</p>
          <p className="text-xl font-black text-slate-600 mt-1">{summary?.refunds != null ? formatINR(summary.refunds) : '₹0'}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Deposit release</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{summary?.netProfit != null ? formatINR(summary.netProfit) : '₹5,70,000'}</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Healthy margin</p>
        </div>
      </div>

      {/* Revenue Trajectory Graph */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Revenue & Profit History</h2>
            <p className="text-xs text-slate-500">Monthly billing trends and bottom-line margin</p>
          </div>
        </div>
        <RevenueExpenseChart />
      </div>

      {/* Fleet Utilization Rate Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Vehicle Utilization & Revenue Leaderboard</h2>
            <p className="text-xs text-slate-500">Days rented, utilization percentage (30-day window), and gross yield</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
            >
              <option value="ALL">All Car Types</option>
              <option value="HATCHBACK">Hatchbacks</option>
              <option value="SEDAN">Sedans</option>
              <option value="SUV">SUVs & 4x4</option>
              <option value="MPV">7-Seater / MPVs</option>
              <option value="LUXURY">Luxury Cars</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bookings Count</th>
                <th className="py-3 px-4">Days on Road</th>
                <th className="py-3 px-4">Yield / Revenue</th>
                <th className="py-3 px-4">Utilization Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStats.map((item) => (
                <tr key={item.vehicleId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{item.brand} {item.model}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{item.registrationNumber}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{item.type}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.bookingsCount} rentals</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.totalDaysRented} days</td>
                  <td className="py-3 px-4 font-black text-emerald-600">{formatINR(item.totalRevenue)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden w-24">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.utilizationRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{item.utilizationRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
