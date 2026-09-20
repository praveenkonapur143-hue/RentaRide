'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Plus,
  Search,
  Wrench,
  DollarSign,
  Shield,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { initialDamageReports, initialVehicles, initialCustomers, initialBookings } from '@/lib/demo-data';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/currency';

export default function DamageReportsPage() {
  const [damages, setDamages] = useState<any[]>(initialDamageReports);
  const [vehicles] = useState<any[]>(initialVehicles);
  const [customers] = useState<any[]>(initialCustomers);
  const [bookings] = useState<any[]>(initialBookings);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    bookingId: initialBookings[0]?.id || '',
    vehicleId: initialVehicles[0]?.id || '',
    customerId: initialCustomers[0]?.id || '',
    damageType: 'SCRATCH',
    description: '',
    severity: 'MINOR',
    estimatedCost: 150,
    finalCharge: 150,
    repairStatus: 'PENDING',
    responsibility: 'CUSTOMER',
    notes: '',
  });

  const handleCreateDamage = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      id: `dmg-${Date.now()}`,
      reportNumber: `DMG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      ...form,
      createdAt: new Date().toISOString(),
    };
    setDamages([newReport, ...damages]);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Damage Incident Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track vehicle body damage, estimated repair costs, customer charge recovery, and workshop resolution.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Damage Incident</span>
        </button>
      </div>

      {/* Damage Incident Cards */}
      {damages.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Zero Active Damage Claims</h3>
          <p className="text-xs text-slate-400 mt-0.5">All fleet vehicles are in verified operational condition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {damages.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-rose-200 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono font-black text-xs text-rose-700">{d.reportNumber}</span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{d.damageType.replace('_', ' ')}</h3>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      d.severity === 'SEVERE'
                        ? 'bg-rose-100 text-rose-800'
                        : d.severity === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {d.severity}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Status: {d.repairStatus}</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{d.description}"
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Estimated Repair</span>
                  <p className="font-black text-slate-900 mt-0.5">{formatINR(d.estimatedCost)}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Customer Charge</span>
                  <p className="font-black text-rose-600 mt-0.5">{formatINR(d.finalCharge)}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Liability</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{d.responsibility}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Ref: <Link href={`/dashboard/bookings/${d.bookingId}`} className="text-blue-600 font-bold hover:underline">{d.bookingId}</Link></span>
                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Damage Report */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Vehicle Damage Incident Report"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDamage} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Damage Classification *
              </label>
              <select
                value={form.damageType}
                onChange={(e) => setForm({ ...form, damageType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="SCRATCH">Paintwork / Surface Scratch</option>
                <option value="DENT">Body Dent / Sheet Metal Impact</option>
                <option value="COLLISION">Collision / Structural Impact</option>
                <option value="GLASS_CRACK">Windshield / Window Crack</option>
                <option value="INTERIOR_TEAR">Upholstery Stain / Tear</option>
                <option value="TYRE_PUNCTURE">Tyre Wall Damage / Blowout</option>
                <option value="OTHER">Mechanical / Other</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Incident Description *
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe exact damage location, dimensions, and probable cause..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Severity Level *
              </label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="MINOR">Minor (Buffing / Touch-up)</option>
                <option value="MODERATE">Moderate (Panel Repair / Repaint)</option>
                <option value="SEVERE">Severe (Major Replacement)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Responsibility Assignment *
              </label>
              <select
                value={form.responsibility}
                onChange={(e) => setForm({ ...form, responsibility: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="CUSTOMER">Customer Liability</option>
                <option value="INSURANCE">Insurance Coverage</option>
                <option value="BUSINESS">Company Goodwill / Wear & Tear</option>
                <option value="THIRD_PARTY">Third Party at Fault</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Repair Cost (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={form.estimatedCost}
                onChange={(e) => setForm({ ...form, estimatedCost: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Final Customer Charge (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={form.finalCharge}
                onChange={(e) => setForm({ ...form, finalCharge: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow"
            >
              Save Damage Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
