'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function RentalAgreementPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.booking) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Preparing self-drive rental agreement...</div>;
  if (!data?.booking) return <div className="p-8 text-center text-sm text-slate-800">Booking agreement not found.</div>;

  const { booking, customer, vehicle, settings } = data;
  const agreementNumber = `AGR-${booking.bookingNumber}`;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/dashboard/bookings/${booking.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trip Details</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Agreement (PDF)</span>
        </button>
      </div>

      {/* Formal Agreement Document */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 text-slate-800 text-xs space-y-8 print:p-0 print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base">
                Z
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">RentaRide</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RentaRide Mobility Solutions Pvt. Ltd.</p>
            <p className="text-[11px] text-slate-500">Cyber One Building, Sector 30, Gurugram, Delhi NCR 122001, India</p>
            <p className="text-[11px] text-slate-500">Toll Free: +91 1800 209 7433 • GSTIN: 07AAAAA1234A1Z5 (SAC 9966)</p>
          </div>

          <div className="text-right">
            <h2 className="text-lg font-black uppercase text-slate-900">Self-Drive Rental Agreement</h2>
            <p className="font-mono font-bold text-emerald-600 mt-1">{agreementNumber}</p>
            <p className="text-slate-400 text-[10px]">Booking Ref: {booking.bookingNumber}</p>
            <p className="text-slate-400 text-[10px]">Date Issued: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Parties Involved */}
        <div className="grid grid-cols-2 gap-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <div>
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2">1. The Host / Lessor (Company)</h3>
            <p className="font-bold text-slate-900">RentaRide Mobility Solutions Pvt. Ltd.</p>
            <p className="text-slate-600">Represented by authorized staff member: Sunita Rao</p>
            <p className="text-slate-600">Self-Drive Fleet Operations Division</p>
          </div>

          <div>
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2">2. The Renter / Lessee (Customer)</h3>
            <p className="font-bold text-slate-900">{customer?.fullName}</p>
            <p className="text-slate-600">Driving Licence: <strong className="font-mono">{customer?.drivingLicenceNumber}</strong></p>
            <p className="text-slate-600">Aadhaar / Govt ID: <strong className="font-mono">{customer?.governmentIdNumber}</strong></p>
            <p className="text-slate-600">Phone: {customer?.phone}</p>
            <p className="text-slate-600">Email: {customer?.email}</p>
            <p className="text-slate-600">Address: {customer?.address || 'On File'}</p>
          </div>
        </div>

        {/* Vehicle & Rental Period */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b pb-1">Vehicle Information</h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Make & Model:</span>
              <span className="font-bold text-slate-900">{vehicle?.brand} {vehicle?.model} ({vehicle?.year})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration Plate:</span>
              <span className="font-mono font-bold text-slate-900">{vehicle?.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category / Fuel:</span>
              <span className="capitalize text-slate-900">{vehicle?.type} • {vehicle?.fuelType?.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Outbound Odometer:</span>
              <span className="text-slate-900">{vehicle?.odometerReading?.toLocaleString('en-IN') || 0} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">FASTag Status:</span>
              <span className="text-emerald-600 font-bold">Active Electronic Toll Tag Fitted</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b pb-1">Rental Itinerary</h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Pickup Date & Time:</span>
              <span className="font-bold text-slate-900">{new Date(booking.pickupDate).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Return Date & Time:</span>
              <span className="font-bold text-slate-900">{new Date(booking.returnDate).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pickup Location:</span>
              <span className="text-slate-900">{booking.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Drop-off Location:</span>
              <span className="text-slate-900">{booking.dropoffLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">KM Package:</span>
              <span className="text-slate-900 capitalize font-bold">{booking.kmPackage || 'Standard 120 km/day'}</span>
            </div>
          </div>
        </div>

        {/* Charges Table */}
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2">3. Rates, GST & Security Deposit Hold</h3>
          <table className="w-full border-collapse border border-slate-200">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="border border-slate-200 p-2 text-left">Description</th>
                <th className="border border-slate-200 p-2 text-center">Unit Rate</th>
                <th className="border border-slate-200 p-2 text-center">Duration</th>
                <th className="border border-slate-200 p-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-2 font-medium">Self-Drive Vehicle Rental Charge</td>
                <td className="border border-slate-200 p-2 text-center">{formatINR(booking.dailyRate)} / day</td>
                <td className="border border-slate-200 p-2 text-center">{booking.days} days</td>
                <td className="border border-slate-200 p-2 text-right font-bold">{formatINR(booking.dailyRate * booking.days)}</td>
              </tr>
              {booking.discount > 0 && (
                <tr>
                  <td className="border border-slate-200 p-2 text-emerald-700" colSpan={3}>Promotional / Corporate Discount</td>
                  <td className="border border-slate-200 p-2 text-right text-emerald-700 font-bold">-{formatINR(booking.discount)}</td>
                </tr>
              )}
              <tr>
                <td className="border border-slate-200 p-2" colSpan={3}>
                  Goods & Services Tax (GST @ 18% - CGST 9% + SGST 9% / IGST 18% - SAC 9966)
                </td>
                <td className="border border-slate-200 p-2 text-right">{formatINR(booking.taxAmount)}</td>
              </tr>
              <tr className="bg-slate-50 font-black">
                <td className="border border-slate-200 p-2.5 text-sm" colSpan={3}>Total Rental Charges</td>
                <td className="border border-slate-200 p-2.5 text-right text-sm">{formatINR(booking.totalAmount)}</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-2 text-slate-600" colSpan={3}>Advance Payment Received via UPI / Card</td>
                <td className="border border-slate-200 p-2 text-right font-bold text-emerald-600">{formatINR(booking.advancePayment)}</td>
              </tr>
              <tr className="bg-amber-50/50 font-bold text-amber-900">
                <td className="border border-slate-200 p-2" colSpan={3}>Remaining Balance Due Upon Return</td>
                <td className="border border-slate-200 p-2 text-right">{formatINR(booking.balanceAmount)}</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-2 text-emerald-900 font-semibold" colSpan={3}>
                  Refundable Security Deposit (To be refunded to customer UPI after FASTag clearance)
                </td>
                <td className="border border-slate-200 p-2 text-right font-bold text-emerald-900">{formatINR(booking.securityDeposit)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms and Conditions under Motor Vehicles Act */}
        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
          <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">4. Terms & Operational Conditions (Motor Vehicles Act)</h3>
          <p>
            <strong>Authorized Driver:</strong> The vehicle shall be driven strictly by the Lessee named above who holds a verified Indian Driving Licence (LMV) or valid International Driving Permit. Commercial use, sub-leasing, or racing is strictly prohibited.
          </p>
          <p>
            <strong>FASTag Electronic Tolls:</strong> All toll charges recorded across national and state expressways are automatically synchronized. Accumulated toll charges will be adjusted against the security deposit prior to refund.
          </p>
          <p>
            <strong>Traffic Challans & Speed Governors:</strong> Vehicles are fitted with speed compliance monitors (80 km/h or 100 km/h as per MoRTH regulations). The Lessee is solely and 100% legally liable for any speeding, red-light, or illegal parking e-challans logged on the Parivahan portal during the rental window.
          </p>
          <p>
            <strong>Fuel Policy & Late Returns:</strong> Vehicle must be returned at the outbound fuel level. Refueling deficit is charged at ₹110/litre + ₹200 refueling service charge. Returns exceeding 1 hour beyond scheduled time accrue late fees of ₹250/hour or ₹1,500/day.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200">
          <div>
            <p className="font-bold text-slate-900 mb-6">Signed on behalf of RentaRide:</p>
            <div className="border-b-2 border-slate-800 pb-1 flex items-center justify-between">
              <span className="font-serif italic text-sm text-emerald-900 font-bold">Sunita Rao</span>
              <span className="text-[10px] text-slate-400">Authorized Fleet Officer</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Date: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-6">Lessee Acceptance & Signature:</p>
            <div className="border-b-2 border-slate-800 pb-1 flex items-center justify-between">
              <span className="font-serif italic text-sm text-slate-900 font-bold">{customer?.fullName}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Aadhaar DigiLocker Certified</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Date: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
