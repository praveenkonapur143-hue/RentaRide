'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Calendar,
  MapPin,
  Shield,
  ShieldCheck,
  CreditCard,
  FileText,
  Key,
  Unlock,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Phone,
  Mail,
  FileBadge2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Radio
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Keyless unlock simulator modal state
  const [activeUnlockBooking, setActiveUnlockBooking] = useState<any | null>(null);
  const [unlockStep, setUnlockStep] = useState<'IDLE' | 'SCANNING' | 'CONNECTED' | 'UNLOCKED'>('IDLE');

  useEffect(() => {
    async function loadAccountData() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (!meData?.user) {
          router.push('/user/login?redirect=/my-account');
          return;
        }

        setUser(meData.user);

        // Fetch bookings
        const bRes = await fetch('/api/bookings');
        const bData = await bRes.json();

        // Fetch customer profile details if available
        let userBookings = [];
        if (bData?.bookings) {
          // If customer user, filter to bookings matching their email or customer ID
          userBookings = bData.bookings.filter(
            (b: any) =>
              b.customerEmail?.toLowerCase() === meData.user.email?.toLowerCase() ||
              b.customerId === meData.user.id
          );

          // If no specific match found, fallback to showing active demo bookings for seamless demo experience
          if (userBookings.length === 0 && meData.user.role === 'CUSTOMER') {
            userBookings = bData.bookings.slice(0, 3);
          }
        }

        setBookings(userBookings);

        // Try to fetch customer profile
        const cRes = await fetch('/api/customers');
        const cData = await cRes.json();
        if (cData?.customers) {
          const matchedCust = cData.customers.find(
            (c: any) => c.email.toLowerCase() === meData.user.email.toLowerCase()
          );
          if (matchedCust) {
            setCustomer(matchedCust);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const handleStartUnlock = (booking: any) => {
    setActiveUnlockBooking(booking);
    setUnlockStep('SCANNING');
    setTimeout(() => {
      setUnlockStep('CONNECTED');
      setTimeout(() => {
        setUnlockStep('UNLOCKED');
      }, 1200);
    }, 1400);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 font-semibold text-sm">Loading your RentaRide profile...</span>
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE_RENTAL' || b.status === 'PENDING'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/25">
              R
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Renta<span className="text-emerald-500">Ride</span>
              </span>
              <span className="block text-[10px] font-bold text-emerald-400 -mt-1 tracking-wide uppercase">
                Customer Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/bookings/new"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <Car className="w-4 h-4" /> Book New Ride
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {user?.name || 'Renter'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    DigiLocker KYC Verified
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {user?.email}
                  </span>
                  {(customer?.phone || user?.phone) && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {customer?.phone || user?.phone}
                    </span>
                  )}
                  {customer?.drivingLicenceNumber && (
                    <span className="flex items-center gap-1.5 font-mono text-emerald-300">
                      <FileBadge2 className="w-3.5 h-3.5 text-emerald-400" /> DL: {customer.drivingLicenceNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trips Taken</span>
                <span className="text-xl font-black text-white">{bookings.length || 1}</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deposit Rate</span>
                <span className="text-xl font-black text-emerald-400">₹0 Free</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keyless Access</span>
                <span className="text-xl font-black text-teal-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Active & Upcoming Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                Active & Upcoming Self-Drive Rentals
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vehicles confirmed with keyless Bluetooth unlock and instant delivery.
              </p>
            </div>
            <Link
              href="/dashboard/bookings/new"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore Fleet</span> <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {activeBookings.length === 0 ? (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-10 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Active Trips Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-5">
                You have no scheduled bookings right now. Pick an authentic Indian car like Thar 4x4, Swift, or Innova Crysta.
              </p>
              <Link
                href="/dashboard/bookings/new"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                Book Self-Drive Car Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 block mb-1">
                          {b.bookingNumber}
                        </span>
                        <h3 className="text-lg font-black text-white">
                          {b.vehicleBrand} {b.vehicleModel}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">
                          {b.vehicleReg || 'DL 01 AB 4321'}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          b.status === 'ACTIVE_RENTAL'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {b.status === 'ACTIVE_RENTAL' ? 'On Trip Now' : 'Confirmed'}
                      </span>
                    </div>

                    {/* Car Image Preview */}
                    <div className="w-full h-44 rounded-2xl bg-slate-950 overflow-hidden relative mb-4 border border-slate-800">
                      {b.vehicleImage ? (
                        <img
                          src={b.vehicleImage}
                          alt={`${b.vehicleBrand} ${b.vehicleModel}`}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Car className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-slate-800">
                        {b.kmPackage?.toUpperCase() || 'STANDARD KM'} • {b.protectionPlan ? 'PEACE OF MIND COVER' : 'ZERO DEPOSIT'}
                      </div>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 mb-4">
                      <div>
                        <span className="text-slate-500 text-[10px] font-bold uppercase block mb-0.5">Pickup</span>
                        <span className="font-semibold text-white block">
                          {new Date(b.pickupDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate block">{b.pickupLocation}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] font-bold uppercase block mb-0.5">Return</span>
                        <span className="font-semibold text-white block">
                          {new Date(b.returnDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate block">{b.dropoffLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Total Rental (incl. 18% GST):</span>
                      <span className="text-sm font-black text-emerald-400">{formatINR(b.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartUnlock(b)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Contactless Unlock</span>
                    </button>

                    <Link
                      href={`/dashboard/bookings/${b.id}/agreement`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Agreement</span>
                    </Link>

                    <Link
                      href={`/dashboard/invoices/${b.id}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Past Trip History */}
        {pastBookings.length > 0 && (
          <div className="pt-4">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Completed Trips History
            </h2>
            <div className="space-y-3">
              {pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                      {b.vehicleImage ? (
                        <img src={b.vehicleImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-6 h-6 m-auto text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        {b.vehicleBrand} {b.vehicleModel}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {b.bookingNumber} • {new Date(b.pickupDate).toLocaleDateString('en-IN')} -{' '}
                        {new Date(b.returnDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span className="text-xs font-black text-slate-300">{formatINR(b.totalAmount)}</span>
                    <Link
                      href={`/dashboard/invoices/${b.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Contactless Unlock Simulator Modal */}
      {activeUnlockBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-slate-800 relative">
              {unlockStep === 'SCANNING' && (
                <>
                  <Radio className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75" />
                </>
              )}
              {unlockStep === 'CONNECTED' && (
                <Smartphone className="w-8 h-8 text-teal-400 animate-bounce" />
              )}
              {unlockStep === 'UNLOCKED' && (
                <Unlock className="w-8 h-8 text-emerald-400" />
              )}
            </div>

            <h3 className="text-lg font-black text-white mb-1">
              {unlockStep === 'SCANNING' && 'Scanning Car Telemetry...'}
              {unlockStep === 'CONNECTED' && 'Connected to Vehicle BLE'}
              {unlockStep === 'UNLOCKED' && 'Car Doors Unlocked!'}
            </h3>

            <p className="text-xs text-slate-400 mb-6">
              {unlockStep === 'SCANNING' && 'Locating Bluetooth beacon for ' + activeUnlockBooking.vehicleBrand + ' ' + activeUnlockBooking.vehicleModel}
              {unlockStep === 'CONNECTED' && 'Exchanging cryptographic key exchange with FASTag smart lock...'}
              {unlockStep === 'UNLOCKED' && 'Indicator lights flashed twice. Please inspect exterior before driving.'}
            </p>

            {unlockStep === 'UNLOCKED' && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 mb-5 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trip Started • Drive Safe</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveUnlockBooking(null);
                setUnlockStep('IDLE');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
