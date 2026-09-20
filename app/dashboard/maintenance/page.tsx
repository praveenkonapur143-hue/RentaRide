'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Plus,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Car
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function MaintenancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(d => {
        setRecords(d.records || []);
        setAlerts(d.alerts || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fleet Maintenance & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track scheduled servicing, repairs, and document renewal deadlines (Insurance, Registration, PUC).
          </p>
        </div>

        <Link
          href="/dashboard/maintenance/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Service Record</span>
        </Link>
      </div>

      {/* Expiry Radar Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">Compliance & Renewal Radar</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Automatic 60-day expiry scan</span>
        </div>

        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            All fleet insurance policies, registrations, and pollution certificates are fully compliant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.title}
                    </span>
                    <span className={`text-xs font-black ${alert.daysRemaining < 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                      {alert.daysRemaining < 0 ? 'EXPIRED' : `${alert.daysRemaining} days`}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    {alert.brand} {alert.model}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Plate: {alert.registrationNumber}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Expires: {alert.expiryDate}</span>
                  <Link href={`/dashboard/vehicles/${alert.vehicleId}`} className="font-bold text-blue-600 hover:underline">
                    Manage Vehicle →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Servicing Costs</p>
            <p className="text-lg font-black text-slate-900">{formatINR(totalCost)}</p>
          </div>
          <Link
            href="/dashboard/maintenance/new"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Service Record</span>
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No maintenance records logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Service Date</th>
                  <th className="py-3 px-4">Next Due</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link href={`/dashboard/vehicles/${r.vehicleId}`} className="hover:text-emerald-600">
                        {r.brand} {r.model}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-mono">{r.registrationNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {r.maintenanceType.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{r.serviceProvider}</td>
                    <td className="py-3.5 px-4 text-slate-600">{new Date(r.serviceDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.nextServiceDate ? new Date(r.nextServiceDate).toLocaleDateString() : '—'}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatINR(r.cost)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={r.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {r.status}
                      </Badge>
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
