'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardCheck, Search, Filter, ShieldCheck, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { initialInspections, initialVehicles, initialBookings } from '@/lib/demo-data';

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Collect all inspections
    fetch('/api/bookings')
      .then(res => res.json())
      .then(bData => {
        // Gather from demo or data store
        setInspections(initialInspections);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = inspections.filter(i => {
    if (filterType !== 'ALL' && i.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vehicle Inspections & Condition Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pre-rental check-outs and post-rental return condition verifications.
          </p>
        </div>

        <Link
          href="/dashboard/bookings"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Go to Bookings to Inspect</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setFilterType('ALL')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            filterType === 'ALL' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Inspections ({inspections.length})
        </button>
        <button
          onClick={() => setFilterType('CHECK_OUT')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            filterType === 'CHECK_OUT' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Check-Out (Pre-Rental)
        </button>
        <button
          onClick={() => setFilterType('RETURN')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            filterType === 'RETURN' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Return (Post-Rental)
        </button>
      </div>

      {/* Inspection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((insp) => (
          <div
            key={insp.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-blue-200 transition"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                    insp.type === 'CHECK_OUT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {insp.type === 'CHECK_OUT' ? 'Check-Out' : 'Return Check'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">Booking: {insp.bookingId}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {new Date(insp.inspectionDate).toLocaleString()}
              </span>
            </div>

            {/* Metrics Checklist */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Odometer</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{insp.odometerReading?.toLocaleString()} km</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Fuel Tank</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{insp.fuelLevel}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Exterior</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{insp.exteriorCondition}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 px-1">
              <div>Interior: <strong>{insp.interiorCondition}</strong></div>
              <div>Tyres: <strong>{insp.tyresCondition}</strong></div>
              <div>Lights: <strong>{insp.lightsCondition}</strong></div>
            </div>

            {insp.existingDamage && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <strong>Pre-existing damage:</strong> {insp.existingDamage}
              </div>
            )}

            {insp.newDamage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <strong>New damage reported:</strong> {insp.newDamage}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Staff: <strong className="text-slate-700">{insp.staffName}</strong>
              </span>
              <span className="italic text-slate-400">Sig: {insp.customerSignature || 'Customer'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
