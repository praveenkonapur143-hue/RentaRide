'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Car,
  User,
  Shield,
  CreditCard,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Printer,
  Ban,
  Clock,
  Plus
} from 'lucide-react';
import { BookingStatusBadge, VehicleStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/currency';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Form states for modals
  const [checkoutForm, setCheckoutForm] = useState({
    odometerReading: 0,
    fuelLevel: '100%',
    exteriorCondition: 'EXCELLENT',
    interiorCondition: 'CLEAN',
    tyresCondition: 'GOOD',
    lightsCondition: 'FUNCTIONAL',
    mirrorsCondition: 'INTACT',
    existingDamage: '',
    customerSignature: '',
    staffName: 'Samantha Reed',
  });

  const [returnForm, setReturnForm] = useState({
    odometerReading: 0,
    fuelLevel: '100%',
    exteriorCondition: 'GOOD',
    interiorCondition: 'CLEAN',
    tyresCondition: 'GOOD',
    lightsCondition: 'FUNCTIONAL',
    mirrorsCondition: 'INTACT',
    newDamage: '',
    lateFees: 0,
    damageFees: 0,
    vehicleStatusAfterReturn: 'AVAILABLE',
    customerSignature: '',
    staffName: 'Samantha Reed',
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'CARD',
    transactionReference: '',
    notes: '',
  });

  const [cancellationReason, setCancellationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadBooking = () => {
    fetch(`/api/bookings/${params.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.booking) {
          setData(d);
          setCheckoutForm(prev => ({
            ...prev,
            odometerReading: d.vehicle?.odometerReading || 0,
            customerSignature: d.customer?.fullName || '',
          }));
          setReturnForm(prev => ({
            ...prev,
            odometerReading: (d.vehicle?.odometerReading || 0) + 150,
            customerSignature: d.customer?.fullName || '',
          }));
          setPaymentForm(prev => ({
            ...prev,
            amount: d.booking.balanceAmount || 0,
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooking();
  }, [params.id]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading reservation data...</div>;
  }

  if (!data?.booking) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-slate-800">Booking not found</p>
        <Link href="/dashboard/bookings" className="text-xs font-bold text-blue-600 hover:underline">
          Return to bookings
        </Link>
      </div>
    );
  }

  const { booking, customer, vehicle, invoice, payments = [], inspections = [], damageReports = [] } = data;

  const isOverdue = booking.status === 'OVERDUE';
  const isActive = booking.status === 'ACTIVE_RENTAL';
  const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'PENDING';
  const isCompleted = booking.status === 'COMPLETED';

  // Handle Check-out submission
  const handleCheckOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutForm),
      });
      if (res.ok) {
        setCheckoutModalOpen(false);
        loadBooking();
      } else {
        const err = await res.json();
        alert(err.error || 'Check-out failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Return submission
  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnForm),
      });
      if (res.ok) {
        setReturnModalOpen(false);
        loadBooking();
      } else {
        const err = await res.json();
        alert(err.error || 'Return failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });
      if (res.ok) {
        setPaymentModalOpen(false);
        loadBooking();
      } else {
        const err = await res.json();
        alert(err.error || 'Payment failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancel submission
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancellationReason }),
      });
      if (res.ok) {
        setCancelModalOpen(false);
        loadBooking();
      } else {
        const err = await res.json();
        alert(err.error || 'Cancellation failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{booking.bookingNumber}</h1>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Created on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Check-Out Trigger */}
          {isConfirmed && (
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Perform Check-Out Inspection</span>
            </button>
          )}

          {/* Return Trigger */}
          {(isActive || isOverdue) && (
            <button
              onClick={() => setReturnModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Process Vehicle Return</span>
            </button>
          )}

          {/* Record Payment */}
          {booking.balanceAmount > 0 && (
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment ({formatINR(booking.balanceAmount)})</span>
            </button>
          )}

          {/* Printable Agreement */}
          <Link
            href={`/dashboard/bookings/${booking.id}/agreement`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Rental Agreement</span>
          </Link>

          {/* Cancel Booking */}
          {(isConfirmed || isActive) && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
              title="Cancel Booking"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Overdue Warning Alert Banner */}
      {isOverdue && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-rose-900">Vehicle Return Overdue</h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Scheduled return was <strong>{new Date(booking.returnDate).toLocaleString()}</strong>.
              Automated late return hourly fees apply upon return inspection processing.
            </p>
          </div>
        </div>
      )}

      {/* 3 Core Cards: Customer, Vehicle, Financials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Renter Details</h3>
            <Link href={`/dashboard/customers/${customer?.id}`} className="text-xs font-bold text-blue-600 hover:underline">
              View CRM
            </Link>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{customer?.fullName}</h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{customer?.phone}</p>
            <p className="text-xs text-slate-500">{customer?.email}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Licence:</span>
              <span className="font-mono font-bold text-slate-800">{customer?.drivingLicenceNumber}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Status:</span>
              <span className="font-semibold text-emerald-600">{customer?.status}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Assigned</h3>
            <Link href={`/dashboard/vehicles/${vehicle?.id}`} className="text-xs font-bold text-blue-600 hover:underline">
              View Specs
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={vehicle?.images?.[0]?.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200'}
              alt={vehicle?.brand}
              className="w-16 h-12 object-cover rounded-xl"
            />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">{vehicle?.brand} {vehicle?.model}</h4>
              <p className="text-xs text-slate-500 font-mono">Plate: {vehicle?.registrationNumber}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Daily Rate:</span>
              <span className="font-bold text-slate-800">{formatINR(booking.dailyRate)} / day</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Fleet Status:</span>
              <span className="font-semibold text-emerald-600">{vehicle?.status}</span>
            </div>
          </div>
        </div>

        {/* Financial Overview Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Ledger</h3>
            <span className="text-xs font-bold text-slate-800">INV: {invoice?.invoiceNumber || 'Auto'}</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Rental Charges ({booking.days} days):</span>
              <span className="font-semibold text-slate-900">{formatINR(booking.dailyRate * booking.days)}</span>
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>-{formatINR(booking.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST ({booking.taxRate}%):</span>
              <span className="font-semibold text-slate-900">{formatINR(booking.taxAmount)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-100 flex justify-between font-extrabold text-slate-900 text-sm">
              <span>Total Amount:</span>
              <span className="text-emerald-600">{formatINR(booking.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Paid to date:</span>
              <span>{formatINR(booking.advancePayment)}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/60 flex justify-between text-amber-900 font-extrabold">
              <span>Balance Due:</span>
              <span>{formatINR(booking.balanceAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Routing Details */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">
          Rental Routing & Duration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Pickup Date & Time</span>
            <p className="font-bold text-slate-800 mt-0.5">{new Date(booking.pickupDate).toLocaleString()}</p>
            <p className="text-[11px] text-slate-500">{booking.pickupLocation}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Scheduled Return Date</span>
            <p className="font-bold text-slate-800 mt-0.5">{new Date(booking.returnDate).toLocaleString()}</p>
            <p className="text-[11px] text-slate-500">{booking.dropoffLocation}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Actual Return Date</span>
            <p className="font-bold text-slate-800 mt-0.5">
              {booking.actualReturnDate ? new Date(booking.actualReturnDate).toLocaleString() : 'Pending Return'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Security Deposit Hold</span>
            <p className="font-black text-slate-900 mt-0.5">{formatINR(booking.securityDeposit)}</p>
            <p className="text-[10px] text-slate-400">Authorized & held</p>
          </div>
        </div>
      </div>

      {/* Inspections History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
            <span>Digital Condition Inspections</span>
          </h3>
          <span className="text-xs text-slate-400">{inspections.length} logged</span>
        </div>

        {inspections.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No inspection records logged yet. Click "Perform Check-Out Inspection" when releasing the vehicle.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspections.map((insp: any) => (
              <div key={insp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    insp.type === 'CHECK_OUT' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {insp.type === 'CHECK_OUT' ? 'Check-Out (Pre-Rental)' : 'Return (Post-Rental)'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(insp.inspectionDate).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
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
                    <p className="font-medium text-slate-800">{insp.staffName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Customer Sig:</span>
                    <p className="font-medium text-slate-800">{insp.customerSignature || 'Signed Digitally'}</p>
                  </div>
                </div>

                {insp.existingDamage && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    <strong>Pre-existing:</strong> {insp.existingDamage}
                  </p>
                )}
                {insp.newDamage && (
                  <p className="text-xs text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-1">
                    <strong>New Damage:</strong> {insp.newDamage}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payments History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Payments Collected</span>
          </h3>
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            + Add Payment
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">No payments logged yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{p.paymentNumber}</td>
                  <td className="py-2.5 px-3 text-slate-600">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{p.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{p.transactionReference || '—'}</td>
                  <td className="py-2.5 px-3 font-black text-emerald-600">{formatINR(p.amount)}</td>
                  <td className="py-2.5 px-3"><PaymentStatusBadge status={p.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cancellation Notice if cancelled */}
      {booking.status === 'CANCELLED' && (
        <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">Booking Cancelled</p>
          <p>Reason: {booking.cancellationReason || 'No reason provided.'}</p>
          <p className="text-[11px] text-slate-400">Cancelled at: {booking.cancelledAt || booking.updatedAt}</p>
        </div>
      )}

      {/* MODAL 1: Check-Out Inspection */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Check-Out Vehicle Inspection Form"
        maxWidth="2xl"
      >
        <form onSubmit={handleCheckOutSubmit} className="space-y-4 text-xs">
          <p className="text-slate-500">
            Verify initial vehicle condition, fuel, odometer reading, and customer acceptance signature before releasing keys.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Odometer (km) *
              </label>
              <input
                type="number"
                required
                value={checkoutForm.odometerReading}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, odometerReading: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fuel Level Tank *
              </label>
              <select
                value={checkoutForm.fuelLevel}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, fuelLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50"
              >
                <option value="100%">100% (Full)</option>
                <option value="75%">75% (3/4 Tank)</option>
                <option value="50%">50% (Half Tank)</option>
                <option value="25%">25% (Quarter Tank)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Exterior Cleanliness & Body
              </label>
              <select
                value={checkoutForm.exteriorCondition}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, exteriorCondition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="EXCELLENT">Excellent / Pristine</option>
                <option value="GOOD">Good (Minor stone chips)</option>
                <option value="FAIR">Fair (Needs wash)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tyres & Tread Condition
              </label>
              <select
                value={checkoutForm.tyresCondition}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, tyresCondition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="GOOD">Good (Adequate tread depth)</option>
                <option value="WORN">Worn (Near legal limit)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Existing Scratches / Notes
              </label>
              <input
                type="text"
                value={checkoutForm.existingDamage}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, existingDamage: e.target.value })}
                placeholder="e.g. Small 1cm scratch on left front door panel"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Inspecting Staff Name *
              </label>
              <input
                type="text"
                required
                value={checkoutForm.staffName}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, staffName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Signature Name *
              </label>
              <input
                type="text"
                required
                value={checkoutForm.customerSignature}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, customerSignature: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow"
            >
              {actionLoading ? 'Activating...' : 'Approve & Activate Rental'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Return Vehicle Inspection */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Vehicle Return Inspection & Settlement"
        maxWidth="2xl"
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
          <p className="text-slate-500">
            Compare final odometer reading and fuel level, inspect for new damages, and compute any late/damage surcharges.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Return Odometer (km) *
              </label>
              <input
                type="number"
                required
                value={returnForm.odometerReading}
                onChange={(e) => setReturnForm({ ...returnForm, odometerReading: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Return Fuel Level *
              </label>
              <select
                value={returnForm.fuelLevel}
                onChange={(e) => setReturnForm({ ...returnForm, fuelLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-slate-50"
              >
                <option value="100%">100% (Full Tank)</option>
                <option value="75%">75% (3/4 Tank)</option>
                <option value="50%">50% (Half Tank)</option>
                <option value="25%">25% (Quarter Tank)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Damage Identified (if any)
              </label>
              <input
                type="text"
                value={returnForm.newDamage}
                onChange={(e) => setReturnForm({ ...returnForm, newDamage: e.target.value })}
                placeholder="Leave blank if vehicle returned undamaged"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Late Return Surcharge (₹)
              </label>
              <input
                type="number"
                min={0}
                value={returnForm.lateFees}
                onChange={(e) => setReturnForm({ ...returnForm, lateFees: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Damage Assessment Charge (₹)
              </label>
              <input
                type="number"
                min={0}
                value={returnForm.damageFees}
                onChange={(e) => setReturnForm({ ...returnForm, damageFees: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fleet Status After Return *
              </label>
              <select
                value={returnForm.vehicleStatusAfterReturn}
                onChange={(e) => setReturnForm({ ...returnForm, vehicleStatusAfterReturn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="AVAILABLE">Available (Clean & Ready for Next Renter)</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance (Requires Detailing or Repairs)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReturnModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow"
            >
              {actionLoading ? 'Processing...' : 'Complete Vehicle Return'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Record Payment */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Payment / Settle Invoice"
        maxWidth="md"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              required
              min={1}
              step="1"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Method *
            </label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="UPI">UPI Instant Payment (GPay, PhonePe, Paytm)</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">IMPS / NEFT Bank Transfer</option>
              <option value="ONLINE">Net Banking / Gateway</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              value={paymentForm.transactionReference}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
              placeholder="e.g. UPI-202609-8822"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow"
            >
              {actionLoading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: Cancel Booking */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Booking Cancellation"
        maxWidth="md"
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Cancelling this booking will immediately release vehicle <strong>{vehicle?.brand} {vehicle?.model}</strong> back to <em>Available</em> status.
          </p>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              required
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Renter requested cancellation due to flight delay..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow"
            >
              {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
