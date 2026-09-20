'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, CheckCircle2, Shield, QrCode } from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}/invoice`)
      .then(res => res.json())
      .then(d => {
        if (d.booking) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-12 text-center text-sm text-slate-400">Rendering GST tax invoice...</div>;
  if (!data?.booking) return <div className="p-12 text-center text-sm text-slate-800">Invoice not found.</div>;

  const { invoice, booking, customer, vehicle, payments = [], settings } = data;
  const invoiceNumber = invoice?.invoiceNumber || `INV-${booking.bookingNumber}`;
  const total = invoice?.totalAmount || booking.totalAmount;
  const paid = invoice?.paidAmount !== undefined ? invoice.paidAmount : booking.advancePayment;
  const balance = invoice?.balanceDue !== undefined ? invoice.balanceDue : booking.balanceAmount;

  // Split 18% GST into CGST 9% and SGST 9%
  const totalTax = invoice?.taxAmount || booking.taxAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/dashboard/bookings/${booking.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Booking</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print GST Invoice / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Canvas */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 text-slate-800 text-xs space-y-8 print:p-0 print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                Z
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">RentaRide</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RentaRide Mobility Solutions Pvt. Ltd.</p>
            <p className="text-[11px] text-slate-500">Cyber One Building, Sector 30, Gurugram, Delhi NCR 122001, India</p>
            <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
              GSTIN: <span className="font-mono text-emerald-800">07AAAAA1234A1Z5</span> • SAC Code: <span className="font-mono">9966</span>
            </p>
            <p className="text-[11px] text-slate-500">Toll Free: +91 1800 209 7433 • Email: billing@rentaride.in</p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-black text-[10px] tracking-wider uppercase border border-emerald-200">
              Tax Invoice
            </span>
            <p className="font-mono font-bold text-slate-900 text-base mt-1.5">{invoiceNumber}</p>
            <div className="mt-2 space-y-0.5 text-[11px] text-slate-500">
              <p>Invoice Date: <strong>{new Date(invoice?.issueDate || booking.createdAt).toLocaleDateString('en-IN')}</strong></p>
              <p>Due Date: <strong>{new Date(invoice?.dueDate || booking.returnDate).toLocaleDateString('en-IN')}</strong></p>
              <p>Booking Ref: <strong className="font-mono">{booking.bookingNumber}</strong></p>
              <p>Place of Supply: <strong>Delhi (State Code: 07)</strong></p>
            </div>
          </div>
        </div>

        {/* Invoice Billed To & Vehicle Rental Period */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To (Recipient / Customer)</h3>
            <p className="font-bold text-sm text-slate-900">{customer?.fullName}</p>
            <p className="text-slate-600 mt-0.5">{customer?.email}</p>
            <p className="text-slate-600 font-mono">{customer?.phone}</p>
            <p className="text-slate-600">{customer?.address || 'Bengaluru, India'}</p>
            <p className="text-slate-500 text-[10px] mt-1 font-mono">
              DL: {customer?.drivingLicenceNumber} • ID: {customer?.governmentIdNumber || 'Aadhaar Verified'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Trip & Fleet Assignment</h3>
            <p className="font-bold text-sm text-slate-900">{vehicle?.brand} {vehicle?.model} ({vehicle?.year})</p>
            <p className="text-slate-600 font-mono">Reg Plate: <strong>{vehicle?.registrationNumber}</strong></p>
            <p className="text-slate-600 mt-0.5">Pickup: {new Date(booking.pickupDate).toLocaleString('en-IN')}</p>
            <p className="text-slate-600">Return: {new Date(booking.returnDate).toLocaleString('en-IN')}</p>
            <p className="text-slate-500 text-[10px] mt-1 font-medium">
              Duration: {booking.days} Day(s) • Plan: {booking.kmPackage || 'Standard'}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <table className="w-full border-collapse border border-slate-200">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="border border-slate-200 p-2.5 text-left">Item Description</th>
                <th className="border border-slate-200 p-2.5 text-center">SAC</th>
                <th className="border border-slate-200 p-2.5 text-center">Daily Rate</th>
                <th className="border border-slate-200 p-2.5 text-center">Days</th>
                <th className="border border-slate-200 p-2.5 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="border border-slate-200 p-2.5 font-medium">
                  Self-Drive Vehicle Rental: {vehicle?.brand} {vehicle?.model} ({vehicle?.registrationNumber})
                </td>
                <td className="border border-slate-200 p-2.5 text-center font-mono text-slate-500">9966</td>
                <td className="border border-slate-200 p-2.5 text-center font-mono">{formatINR(booking.dailyRate)}</td>
                <td className="border border-slate-200 p-2.5 text-center">{booking.days} days</td>
                <td className="border border-slate-200 p-2.5 text-right font-bold">{formatINR(booking.dailyRate * booking.days)}</td>
              </tr>

              {invoice?.lateFees > 0 && (
                <tr>
                  <td className="border border-slate-200 p-2.5 font-medium text-rose-700" colSpan={4}>
                    Late Return Surcharge Fees
                  </td>
                  <td className="border border-slate-200 p-2.5 text-right font-bold text-rose-700">{formatINR(invoice.lateFees)}</td>
                </tr>
              )}

              {invoice?.damageFees > 0 && (
                <tr>
                  <td className="border border-slate-200 p-2.5 font-medium text-rose-700" colSpan={4}>
                    Vehicle Damage Repair & Assessment Fee
                  </td>
                  <td className="border border-slate-200 p-2.5 text-right font-bold text-rose-700">{formatINR(invoice.damageFees)}</td>
                </tr>
              )}

              {booking.discount > 0 && (
                <tr>
                  <td className="border border-slate-200 p-2.5 font-medium text-emerald-700" colSpan={4}>
                    Promotional / Referral Discount
                  </td>
                  <td className="border border-slate-200 p-2.5 text-right font-bold text-emerald-700">-{formatINR(booking.discount)}</td>
                </tr>
              )}

              {/* GST Tax Rows */}
              <tr>
                <td className="border border-slate-200 p-2 text-slate-600" colSpan={4}>
                  Central Goods & Services Tax (CGST @ 9%)
                </td>
                <td className="border border-slate-200 p-2 text-right font-semibold">{formatINR(cgst)}</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-2 text-slate-600" colSpan={4}>
                  State Goods & Services Tax (SGST @ 9%)
                </td>
                <td className="border border-slate-200 p-2 text-right font-semibold">{formatINR(sgst)}</td>
              </tr>

              <tr className="bg-slate-50 font-black text-sm">
                <td className="border border-slate-200 p-3" colSpan={4}>Total Invoice Amount (INR)</td>
                <td className="border border-slate-200 p-3 text-right text-base text-emerald-800">{formatINR(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payments History Ledger & UPI QR Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Receipts Applied</h3>
            {payments.length === 0 ? (
              <p className="text-slate-400 italic">No payments recorded against this invoice yet.</p>
            ) : (
              <table className="w-full border-collapse border border-slate-200">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="border border-slate-200 p-2 text-left">Receipt #</th>
                    <th className="border border-slate-200 p-2 text-left">Date</th>
                    <th className="border border-slate-200 p-2 text-left">Mode</th>
                    <th className="border border-slate-200 p-2 text-left">UTR / Ref</th>
                    <th className="border border-slate-200 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="border border-slate-200 p-2 font-mono">{p.paymentNumber}</td>
                      <td className="border border-slate-200 p-2">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                      <td className="border border-slate-200 p-2 font-bold">{p.paymentMethod}</td>
                      <td className="border border-slate-200 p-2 text-slate-500 font-mono text-[10px]">{p.transactionReference || 'Direct'}</td>
                      <td className="border border-slate-200 p-2 text-right font-bold text-emerald-600">{formatINR(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* UPI QR Code Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-emerald-300 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-emerald-800" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-950">Pay instantly via UPI QR Code</h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM. VPA: <strong className="font-mono">rentaride@hdfcbank</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Totals & Balance Due Box */}
          <div className="md:col-span-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Gross Total:</span>
                <span className="font-bold text-slate-900">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Paid to Date:</span>
                <span className="font-bold">-{formatINR(paid)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black">
                <span className="text-slate-900">Balance Due:</span>
                <span className={balance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {formatINR(balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="pt-8 border-t border-slate-200 text-center text-slate-400 space-y-1">
          <p className="font-bold text-slate-600">Thank you for driving with RentaRide! Never Stop Living.</p>
          <p className="text-[10px]">Tax Invoice generated under Section 31 of the Central Goods and Services Tax Act, 2017.</p>
        </div>
      </div>
    </div>
  );
}
