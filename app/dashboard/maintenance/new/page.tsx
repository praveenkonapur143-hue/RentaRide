'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wrench, Save } from 'lucide-react';
import { initialVehicles } from '@/lib/demo-data';

export default function NewMaintenancePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleId: initialVehicles[0]?.id || '',
    maintenanceType: 'ROUTINE_SERVICE',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: '',
    cost: 150,
    odometerReading: initialVehicles[0]?.odometerReading || 10000,
    serviceProvider: 'Bay Area Fleet Services',
    description: '',
    status: 'COMPLETED',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/dashboard/maintenance');
        router.refresh();
      } else {
        alert('Failed to save maintenance record');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/maintenance"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Log Fleet Maintenance</h1>
          <p className="text-xs text-slate-500">Record servicing, tyre changes, and workshop overhaul expenses.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Vehicle *
            </label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Type *
            </label>
            <select
              value={form.maintenanceType}
              onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="ROUTINE_SERVICE">Scheduled Routine Service</option>
              <option value="OIL_CHANGE">Engine Oil & Filter Change</option>
              <option value="BRAKE_SERVICE">Brake Pads & Rotor Service</option>
              <option value="TYRE_REPLACEMENT">Tyre Replacement & Alignment</option>
              <option value="ENGINE_REPAIR">Engine & Transmission Repair</option>
              <option value="BODYWORK">Bodywork & Paint Touchup</option>
              <option value="OTHER">Other Fleet Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Maintenance Status *
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress (Vehicle Under Maintenance)</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Date *
            </label>
            <input
              type="date"
              required
              value={form.serviceDate}
              onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cost of Service (₹) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Odometer Reading (km)
            </label>
            <input
              type="number"
              min={0}
              value={form.odometerReading}
              onChange={(e) => setForm({ ...form, odometerReading: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Provider / Workshop
            </label>
            <input
              type="text"
              value={form.serviceProvider}
              onChange={(e) => setForm({ ...form, serviceProvider: e.target.value })}
              placeholder="e.g. Certified Toyota Care"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Parts Replaced
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Replaced front brake pads, topped up transmission fluid..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Link
            href="/dashboard/maintenance"
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow"
          >
            {loading ? 'Saving...' : 'Save Maintenance Log'}
          </button>
        </div>
      </form>
    </div>
  );
}
