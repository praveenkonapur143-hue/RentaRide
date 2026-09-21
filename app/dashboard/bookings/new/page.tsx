'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Car,
  User,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Calculator,
  Navigation,
  ShieldCheck,
  Home,
  MapPin,
  Lock
} from 'lucide-react';
import PaymentModal from '@/components/payment/PaymentModal';
import { BookingService } from '@/modules/booking/service';
import {
  formatINR,
  KM_PACKAGES,
  PROTECTION_PLANS,
  POPULAR_INDIAN_HUBS,
  KmPackage,
  ProtectionPlan
} from '@/lib/currency';

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicleId') || '');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('location') || 'Bengaluru - Kempegowda Airport (BLR) T1'
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    searchParams.get('location') || 'Bengaluru - Kempegowda Airport (BLR) T1'
  );
  const [deliveryMode, setDeliveryMode] = useState<'HUB_PICKUP' | 'DOORSTEP_DELIVERY'>(
    (searchParams.get('delivery') as any) === 'DOORSTEP' ? 'DOORSTEP_DELIVERY' : 'HUB_PICKUP'
  );

  // Kilometre Packages
  const [kmPackage, setKmPackage] = useState<'standard' | 'traveler' | 'unlimited'>('standard');
  const [protectionPlan, setProtectionPlan] = useState<'standard' | 'peace_of_mind'>('peace_of_mind');

  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [returnTime, setReturnTime] = useState('18:00');
  const [discount, setDiscount] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [notes, setNotes] = useState('');

  // Realtime Availability check state
  const [availabilityCheck, setAvailabilityCheck] = useState<{ available: boolean; conflictReason?: string } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Set default returnDate to 3 days after pickup if empty
  useEffect(() => {
    if (!returnDate && pickupDate) {
      const p = new Date(pickupDate);
      p.setDate(p.getDate() + 3);
      setReturnDate(p.toISOString().split('T')[0]);
    }
  }, [pickupDate]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load Customers & Vehicles
  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, vRes, meRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/vehicles?includeArchived=false'),
          fetch('/api/auth/me'),
        ]);
        const cData = await cRes.json();
        const vData = await vRes.json();
        const meData = await meRes.json();

        const customerList = cData.customers || [];
        setVehicles(vData.vehicles || []);

        let resolvedCustomerId = searchParams.get('customerId') || '';

        if (meData?.user) {
          setCurrentUser(meData.user);
          if (meData.user.role === 'CUSTOMER') {
            const matched = customerList.find(
              (c: any) =>
                c.email?.toLowerCase() === meData.user.email?.toLowerCase() ||
                c.id === meData.user.id
            );
            if (matched) {
              resolvedCustomerId = matched.id;
            } else {
              resolvedCustomerId = meData.user.id;
              customerList.unshift({
                id: meData.user.id,
                fullName: meData.user.name,
                email: meData.user.email,
                phone: meData.user.phone || '+91 98450 12399',
                drivingLicenceNumber: 'DL-VERIFIED-FILE',
                status: 'ACTIVE'
              });
            }
          }
        }

        if (!resolvedCustomerId && customerList.length) {
          resolvedCustomerId = customerList[0].id;
        }

        setCustomers(customerList);
        setCustomerId(resolvedCustomerId);

        if (!vehicleId && vData.vehicles?.length) {
          setVehicleId(vData.vehicles[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Selected vehicle object
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  // Re-check availability when vehicleId, pickupDate, or returnDate change
  useEffect(() => {
    if (!vehicleId || !pickupDate || !returnDate) return;

    const startIso = `${pickupDate}T${pickupTime}:00.000Z`;
    const endIso = `${returnDate}T${returnTime}:00.000Z`;

    setCheckingAvailability(true);
    fetch(`/api/bookings/availability?vehicleId=${vehicleId}&pickupDate=${encodeURIComponent(startIso)}&returnDate=${encodeURIComponent(endIso)}`)
      .then(res => res.json())
      .then(data => {
        setAvailabilityCheck(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setCheckingAvailability(false);
      });
  }, [vehicleId, pickupDate, pickupTime, returnDate, returnTime]);

  // Calculate pricing breakdown with KM Package, Damage Protection, and Doorstep delivery
  const startIso = `${pickupDate}T${pickupTime}:00.000Z`;
  const endIso = `${returnDate}T${returnTime}:00.000Z`;

  const selectedKmPkg = KM_PACKAGES.find(p => p.id === kmPackage) || KM_PACKAGES[0];
  const selectedProtPlan = PROTECTION_PLANS.find(p => p.id === protectionPlan) || PROTECTION_PLANS[0];

  const baseDailyRate = selectedVehicle ? selectedVehicle.dailyPrice : 2000;
  const effectiveDailyRate = baseDailyRate + selectedKmPkg.pricePerDayAddon + selectedProtPlan.pricePerDay;
  const deliveryFee = deliveryMode === 'DOORSTEP_DELIVERY' ? 300 : 0;
  const securityDeposit = selectedVehicle ? selectedVehicle.securityDeposit : 3000;

  const rawPricing = BookingService.calculatePricing({
    dailyRate: effectiveDailyRate,
    pickupDate: startIso,
    returnDate: endIso,
    discount,
    taxRate: 18, // 18% GST in India
    securityDeposit,
    advancePayment,
  });

  const finalSubtotal = rawPricing.subtotal + deliveryFee;
  const finalTax = Math.round((finalSubtotal - rawPricing.discount) * 0.18);
  const finalTotal = (finalSubtotal - rawPricing.discount) + finalTax;
  const finalBalance = Math.max(0, finalTotal - advancePayment);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    setError('');

    if (!vehicleId) {
      setError('Please select a vehicle to reserve.');
      return;
    }

    const targetCustomerId = customerId || (currentUser?.role === 'CUSTOMER' ? currentUser.id : '');
    if (!targetCustomerId) {
      setError('Renter identity is required. Please sign in or select a customer.');
      return;
    }

    if (availabilityCheck && !availabilityCheck.available) {
      setError(availabilityCheck.conflictReason || 'Vehicle is not available during selected dates.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId: targetCustomerId,
        vehicleId,
        pickupLocation,
        dropoffLocation,
        pickupDate: startIso,
        returnDate: endIso,
        dailyRate: effectiveDailyRate,
        discount,
        taxRate: 18,
        taxAmount: finalTax,
        totalAmount: finalTotal,
        advancePayment,
        balanceAmount: finalBalance,
        kmPackage,
        protectionPlan,
        deliveryMode,
        deliveryFee,
        notes,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to create booking');
        setSubmitting(false);
        return;
      }

      if (currentUser?.role === 'CUSTOMER') {
        router.push('/my-account');
      } else {
        router.push(`/dashboard/bookings/${data.booking.id}`);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Submission error');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-36 md:pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={currentUser?.role === 'CUSTOMER' ? '/' : '/dashboard/bookings'}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 active:scale-95 transition shadow-sm"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Self-Drive Trip</h1>
          <p className="text-xs text-slate-500">
            Real-time availability verification, flexible KM package selection, and 18% GST invoicing.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Vehicle Selection */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer & Vehicle Assignment</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Renter Identity (Aadhaar / DL Verified) *
                </label>
                {currentUser?.role === 'CUSTOMER' ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {customers.find((c) => c.id === customerId)?.fullName || currentUser.name}
                      </span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        DigiLocker KYC Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800 flex flex-wrap gap-x-3">
                      <span>DL: {customers.find((c) => c.id === customerId)?.drivingLicenceNumber || 'Verified on file'}</span>
                      <span>Phone: {customers.find((c) => c.id === customerId)?.phone || currentUser.phone || 'On file'}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      required
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} ({c.drivingLicenceNumber})
                        </option>
                      ))}
                    </select>
                    <Link
                      href="/dashboard/customers/new"
                      className="inline-block text-[11px] font-bold text-emerald-600 hover:underline mt-1.5"
                    >
                      + Quick Register Customer (Aadhaar / DigiLocker)
                    </Link>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Fleet Vehicle *
                </label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.registrationNumber}) - {formatINR(v.dailyPrice)}/day
                    </option>
                  ))}
                </select>

                {/* Selected vehicle quick preview & availability status */}
                <div className="mt-2 text-xs flex items-center justify-between">
                  {checkingAvailability ? (
                    <span className="text-[11px] text-slate-400 font-medium">Checking collision matrix...</span>
                  ) : availabilityCheck?.available ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Vehicle is Available
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Collision Detected (Booked)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {availabilityCheck && !availabilityCheck.available && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {availabilityCheck.conflictReason}
              </div>
            )}
          </div>

          {/* Kilometre Package Selector */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Select Kilometre Package</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {KM_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setKmPackage(pkg.id as any)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    kmPackage === pkg.id
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {pkg.badge}
                    </span>
                    <h3 className="font-extrabold text-xs text-slate-900 mt-2">{pkg.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-black text-slate-900">
                    {pkg.pricePerDayAddon === 0 ? 'Included' : `+${formatINR(pkg.pricePerDayAddon)}/day`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RentaRide Shield Damage Protection Plan */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RentaRide Shield Damage Protection</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROTECTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setProtectionPlan(plan.id as any)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    protectionPlan === plan.id
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {plan.badge}
                    </span>
                    <h3 className="font-extrabold text-xs text-slate-900 mt-2">{plan.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{plan.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-black text-slate-900">
                    {plan.pricePerDay === 0 ? 'Standard Cover' : `+${formatINR(plan.pricePerDay)}/day`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule & Pick-up Locations */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Rental Schedule & Delivery Mode</span>
            </h2>

            {/* Delivery mode radio toggle */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMode('HUB_PICKUP')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                  deliveryMode === 'HUB_PICKUP'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Airport / Metro Hub (Free)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('DOORSTEP_DELIVERY')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                  deliveryMode === 'DOORSTEP_DELIVERY'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Doorstep Delivery (+₹300)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trip Start Date & Time *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trip Return Date & Time *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <input
                    type="time"
                    required
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickup Hub / Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Bengaluru Airport T1 or Doorstep Address"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Drop-off Hub / Return Address *
                </label>
                <input
                  type="text"
                  required
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="e.g. Same as pickup"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Financial Adjustments & Advance Payment */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Promo Discount & Advance Payment</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Promotional Discount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step="50"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Advance Payment via UPI (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step="100"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Self-Drive Trip Notes / Outstation Destination
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Heading to Coorg / Ooty, flight arriving at 10 AM, baby booster seat required..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Engine Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-5 sticky top-24">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Fare Breakdown</span>
            </h3>

            {/* Selected Vehicle Mini Card */}
            {selectedVehicle && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={selectedVehicle.images?.[0]?.url || '/images/cars/swift.jpg'}
                  alt={selectedVehicle.brand}
                  className="w-16 h-12 object-cover rounded-xl shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-bold">{formatINR(selectedVehicle.dailyPrice)} / day</p>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedVehicle.registrationNumber}</span>
                </div>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Base Rental ({rawPricing.days} {rawPricing.days === 1 ? 'day' : 'days'}):</span>
                <span className="font-medium text-slate-900">{formatINR(baseDailyRate * rawPricing.days)}</span>
              </div>

              {selectedKmPkg.pricePerDayAddon > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>KM Package Add-on:</span>
                  <span className="font-medium text-slate-900">+{formatINR(selectedKmPkg.pricePerDayAddon * rawPricing.days)}</span>
                </div>
              )}

              {selectedProtPlan.pricePerDay > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>RentaRide Shield Protection:</span>
                  <span className="font-medium text-slate-900">+{formatINR(selectedProtPlan.pricePerDay * rawPricing.days)}</span>
                </div>
              )}

              {deliveryFee > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Doorstep Delivery:</span>
                  <span className="font-medium text-slate-900">+{formatINR(deliveryFee)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Rental Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatINR(finalSubtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>GST (18% - CGST 9% + SGST 9%):</span>
                <span className="font-medium text-slate-900">{formatINR(finalTax)}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-800">Total Payable:</span>
                <span className="font-black text-slate-900 text-lg">{formatINR(finalTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-600">
                <span>Advance Paid:</span>
                <span className="font-bold">-{formatINR(advancePayment)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <span className="font-bold text-amber-900">Balance Due:</span>
                <span className="font-black text-amber-700 text-base">{formatINR(finalBalance)}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px]">
                <span>Refundable Deposit:</span>
                <span className="font-bold text-slate-900">{formatINR(securityDeposit)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-2.5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                disabled={!selectedVehicle || (availabilityCheck ? !availabilityCheck.available : false)}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay & Confirm via Razorpay / UPI</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || (availabilityCheck ? !availabilityCheck.available : false)}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition border ${
                  submitting || (availabilityCheck ? !availabilityCheck.available : false)
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                {submitting ? (
                  <span>Generating Agreement...</span>
                ) : (
                  <span>Reserve with Pay Later / Cash</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile Sticky Action Bar */}
      <aside
        aria-label="Mobile Instant Booking Confirmation"
        className="fixed bottom-16 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-4 py-3 md:hidden flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
      >
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Payable</div>
          <div className="text-base font-black text-emerald-400 truncate">
            {formatINR(finalTotal)}
            <span className="text-[10px] font-medium text-slate-400 ml-1">({rawPricing.days}d)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || (availabilityCheck ? !availabilityCheck.available : false)}
            className="px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 disabled:opacity-50 transition"
          >
            {submitting ? 'Booking...' : 'Pay Later'}
          </button>
          <button
            type="button"
            onClick={() => setPaymentModalOpen(true)}
            disabled={!selectedVehicle || (availabilityCheck ? !availabilityCheck.available : false)}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Pay & Book</span>
          </button>
        </div>
      </aside>

      {/* Payment Gateway Modal */}
      {selectedVehicle && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          vehicle={selectedVehicle}
          customer={
            currentUser?.role === 'CUSTOMER'
              ? {
                  id: customerId || currentUser.id,
                  name: currentUser.name,
                  email: currentUser.email,
                  phone: currentUser.phone || '+91 98450 12399',
                  drivingLicenceNumber: 'KA-0520190089123'
                }
              : customers.find(c => c.id === customerId)
          }
          bookingParams={{
            city: selectedCity,
            pickupDate,
            returnDate,
            days: rawPricing.days,
            deliveryMode,
            plan: protectionPlan === 'peace_of_mind' ? 'PEACE_OF_MIND' : 'STANDARD'
          }}
        />
      )}
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading booking engine...</div>}>
      <NewBookingForm />
    </Suspense>
  );
}
