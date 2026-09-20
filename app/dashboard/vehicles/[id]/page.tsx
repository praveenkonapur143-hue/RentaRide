'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Car,
  Calendar,
  Users,
  Fuel,
  Gauge,
  Shield,
  FileText,
  Wrench,
  ClipboardCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  DollarSign,
  Plus
} from 'lucide-react';
import { VehicleStatusBadge, BookingStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rentals' | 'maintenance' | 'inspections' | 'damages'>('overview');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/vehicles/${params.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.vehicle) setData(d);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading vehicle details...</div>;
  }

  if (!data?.vehicle) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-slate-800">Vehicle not found</p>
        <Link href="/dashboard/vehicles" className="text-xs font-bold text-blue-600 hover:underline">
          Return to fleet list
        </Link>
      </div>
    );
  }

  const { vehicle, bookings = [], maintenance = [], inspections = [], damageReports = [] } = data;

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/vehicles/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await res.json();
      if (res.ok && d.vehicle) {
        setData((prev: any) => ({ ...prev, vehicle: d.vehicle }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/vehicles"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Plate: {vehicle.registrationNumber} • {vehicle.year} • Category: {vehicle.type}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick status change */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 px-2">Status:</span>
            <select
              value={vehicle.status}
              disabled={statusUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none pr-2 py-1"
            >
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="RENTED">Rented</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <Link
            href={`/dashboard/bookings/new?vehicleId=${vehicle.id}`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Overview & Specs</span>
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'rentals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Rental History ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'inspections'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Inspections ({inspections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'maintenance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Records ({maintenance.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('damages')}
          className={`pb-3 px-4 text-xs font-bold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'damages'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Damage Logs ({damageReports.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Specs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Photos gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={vehicle.images?.[0]?.url || '/images/cars/swift.jpg'}
                  alt={vehicle.brand}
                  className="w-full h-full object-cover"
                />
              </div>

              {vehicle.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {vehicle.images.map((img: any, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            {vehicle.notes && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fleet Operational Notes</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{vehicle.notes}</p>
              </div>
            )}
          </div>

          {/* Specs & Pricing Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Technical Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Daily Rate</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{formatINR(vehicle.dailyPrice)} <span className="text-xs font-normal text-slate-500">/ day</span></p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Security Deposit</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{formatINR(vehicle.securityDeposit)}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Seating Capacity</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{vehicle.seatingCapacity} Passengers</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Fuel Engine</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 capitalize">{vehicle.fuelType.toLowerCase()}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Transmission</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 capitalize">{vehicle.transmission.toLowerCase()}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Odometer Reading</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{vehicle.odometerReading?.toLocaleString() || 0} km</p>
                </div>
              </div>
            </div>

            {/* Compliance Radar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Regulatory & Compliance Tracking</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">Comprehensive Insurance</p>
                    <p className="text-[11px] text-slate-500">Commercial liability policy</p>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{vehicle.insuranceExpiryDate || 'Not configured'}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">Vehicle Registration (DMV/RTO)</p>
                    <p className="text-[11px] text-slate-500">Road fitness & registration permit</p>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{vehicle.registrationExpiryDate || 'Not configured'}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">Pollution Certificate (PUC)</p>
                    <p className="text-[11px] text-slate-500">Emissions compliance</p>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{vehicle.pollutionExpiryDate || 'Not configured'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rentals History */}
      {activeTab === 'rentals' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Historical & Active Bookings</h3>
          </div>
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No bookings on record for this vehicle.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Rental Dates</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{b.days} days</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatINR(b.totalAmount)}</td>
                    <td className="py-3.5 px-4"><BookingStatusBadge status={b.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/dashboard/bookings/${b.id}`} className="font-bold text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 3: Inspections */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Digital Inspection Trail</h3>
          {inspections.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No inspections logged yet.</div>
          ) : (
            <div className="space-y-4">
              {inspections.map((insp: any) => (
                <div key={insp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      insp.type === 'CHECK_OUT' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {insp.type === 'CHECK_OUT' ? 'Check-Out (Pre-Rental)' : 'Return (Post-Rental)'}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(insp.inspectionDate).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Odometer:</span>
                      <p className="font-bold text-slate-800">{insp.odometerReading?.toLocaleString()} km</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Fuel Level:</span>
                      <p className="font-bold text-slate-800">{insp.fuelLevel}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Inspector:</span>
                      <p className="font-bold text-slate-800">{insp.staffName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Customer Sig:</span>
                      <p className="font-bold text-slate-800">{insp.customerSignature || 'Digitally Signed'}</p>
                    </div>
                  </div>

                  {insp.existingDamage && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2">
                      <strong>Existing Notes:</strong> {insp.existingDamage}
                    </p>
                  )}
                  {insp.newDamage && (
                    <p className="text-xs text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-2">
                      <strong>New Damage:</strong> {insp.newDamage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Service & Maintenance Ledger</h3>
            <Link
              href="/dashboard/maintenance/new"
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Log Maintenance
            </Link>
          </div>

          {maintenance.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No maintenance records logged.</div>
          ) : (
            <div className="space-y-3">
              {maintenance.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                      {m.maintenanceType.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">{m.description}</h4>
                    <p className="text-[11px] text-slate-500">Provider: {m.serviceProvider} • Odometer: {m.odometerReading?.toLocaleString()} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{formatINR(m.cost)}</p>
                    <p className="text-[10px] text-slate-400">{new Date(m.serviceDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Damage Logs */}
      {activeTab === 'damages' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Damage Incident Reports</h3>
          {damageReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">Pristine condition: Zero damage incident reports logged.</div>
          ) : (
            <div className="space-y-3">
              {damageReports.map((d: any) => (
                <div key={d.id} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-700">{d.reportNumber} - {d.damageType}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {d.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{d.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-100 text-xs">
                    <span className="text-slate-500">Repair Cost: <strong>{formatINR(d.estimatedCost)}</strong></span>
                    <span className="text-slate-500">Final Customer Charge: <strong>{formatINR(d.finalCharge)}</strong></span>
                    <span className="font-bold text-slate-700">Status: {d.repairStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
