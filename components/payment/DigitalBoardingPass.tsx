'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  QrCode,
  Download,
  FileText,
  Car,
  MapPin,
  Calendar,
  Key,
  ShieldCheck,
  Share2,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface DigitalBoardingPassProps {
  passData: {
    bookingId: string;
    bookingNumber: string;
    paymentId: string;
    vehicle: {
      id: string;
      brand: string;
      model: string;
      registrationNumber: string;
      year: number;
      fuelType: string;
      fastagEnabled: boolean;
      fastagBalance: string;
    };
    customer: {
      name: string;
      phone: string;
      email: string;
      licence: string;
    };
    schedule: {
      pickupDate: string;
      returnDate: string;
      pickupLocation: string;
      deliveryMode: string;
      gatePassId: string;
    };
    financials: {
      totalPaid: number;
      currency: string;
      taxInvoiceNumber: string;
    };
  };
  onClose?: () => void;
}

export default function DigitalBoardingPass({ passData, onClose }: DigitalBoardingPassProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate celebratory confetti particles
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'];
    const p = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60 - 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      delay: Math.random() * 0.5
    }));
    setParticles(p);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
      {/* CSS Confetti Burst Animation */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((pt) => (
          <div
            key={pt.id}
            className="absolute rounded-sm animate-bounce"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: `${pt.size}px`,
              height: `${pt.size * 1.5}px`,
              backgroundColor: pt.color,
              animationDuration: `${2 + Math.random()}s`,
              animationDelay: `${pt.delay}s`,
              opacity: 0.85,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Main Boarding Pass Ticket */}
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl overflow-hidden shadow-2xl text-white">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-950/30 px-2.5 py-0.5 rounded-full text-white font-black">
                  Official Mobility Pass
                </span>
                <span className="text-emerald-100 text-xs font-semibold">Payment Verified</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                Self-Drive Car Confirmed!
              </h2>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-emerald-100 uppercase font-mono">Booking Code</p>
            <p className="text-lg font-black tracking-wider text-white font-mono">
              {passData.bookingNumber}
            </p>
          </div>
        </div>

        {/* Ticket Body Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Vehicle & Gate Pass Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-800">
            <div className="sm:col-span-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-wide">
                  {passData.vehicle.fuelType} • FASTag Pre-Loaded
                </span>
                <h3 className="text-xl font-black text-white">
                  {passData.vehicle.brand} {passData.vehicle.model}
                </h3>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-xs font-black text-amber-300">
                  {passData.vehicle.registrationNumber}
                </div>
              </div>
            </div>

            <div className="sm:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">FASTag Toll Gate Pass</p>
              <p className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                {passData.schedule.gatePassId}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Active Balance: <strong className="text-white">{passData.vehicle.fastagBalance}</strong>
              </p>
            </div>
          </div>

          {/* Trip Dates & Hub Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pickup Schedule</span>
              </span>
              <p className="text-sm font-extrabold text-white">
                {passData.schedule.pickupDate} (From 09:00 AM)
              </p>
              <p className="text-slate-400 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{passData.schedule.pickupLocation}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Return Due</span>
              </span>
              <p className="text-sm font-extrabold text-white">
                {passData.schedule.returnDate} (Until 08:00 PM)
              </p>
              <p className="text-slate-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Same location drop • Fuel level adjusted on UPI</span>
              </p>
            </div>
          </div>

          {/* Tear-Off Divider with Punch-Out Circles */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-slate-700" />
            <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-slate-950 border-r border-slate-800" />
            <div className="absolute -right-10 top-0 w-8 h-8 rounded-full bg-slate-950 border-l border-slate-800" />
          </div>

          {/* Bottom QR Code & Handover Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              {/* Stylized QR Code Box */}
              <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg text-slate-900 text-center">
                <QrCode className="w-20 h-20 mx-auto" />
                <span className="text-[9px] font-mono font-black tracking-widest uppercase block mt-1">
                  TAP TO UNLOCK
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Show this QR code at transit hub
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                  Your sanitized vehicle will be released in under 60 seconds with digital biometric/licence verification.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-mono font-bold">
                  Txn Ref: {passData.paymentId}
                </div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Amount Paid</span>
              <p className="text-2xl font-black text-white">
                {formatINR(passData.financials.totalPaid)}
              </p>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                Includes 18% GST & Deposit Hold
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/invoices/${passData.bookingId}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice (GST)</span>
            </Link>

            <Link
              href={`/dashboard/bookings/${passData.bookingId}/agreement`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Rental Agreement</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/bookings"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <span>Manage in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
