'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  ArrowDownLeft,
  Calendar,
  FileText,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { initialPayments, initialBookings, initialCustomers } from '@/lib/demo-data';
import { PaymentStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('ALL');

  useEffect(() => {
    // Merge payments with customer names
    const enriched = initialPayments.map(p => {
      const customer = initialCustomers.find(c => c.id === p.customerId);
      const booking = initialBookings.find(b => b.id === p.bookingId);
      return {
        ...p,
        customerName: customer?.fullName || 'Valued Customer',
        bookingNumber: booking?.bookingNumber || p.bookingId,
      };
    });
    setPayments(enriched);
    setLoading(false);
  }, []);

  const totalCollected = payments
    .filter(p => p.paymentStatus === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter(p => {
    if (methodFilter !== 'ALL' && p.paymentMethod !== methodFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Payments & Invoices Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cash receipts, credit card authorizations, UPI transactions, and formal tax invoices.
          </p>
        </div>

        <Link
          href="/dashboard/bookings"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          <span>Record Booking Payment</span>
        </Link>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Received</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{formatINR(totalCollected)}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="text-xl">₹</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions Processed</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{payments.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Channels</p>
            <p className="text-sm font-bold text-slate-700 mt-1">UPI, Card, Net Banking, FASTag</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['ALL', 'UPI', 'CARD', 'CASH', 'BANK_TRANSFER', 'ONLINE'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                methodFilter === m
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">Receipt #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Transaction Ref</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.paymentNumber}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{p.customerName}</td>
                <td className="py-3.5 px-4">
                  <Link href={`/dashboard/bookings/${p.bookingId}`} className="text-emerald-600 font-bold hover:underline">
                    {p.bookingNumber}
                  </Link>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-700">{p.paymentMethod}</td>
                <td className="py-3.5 px-4 text-slate-400 font-mono">{p.transactionReference || '—'}</td>
                <td className="py-3.5 px-4 font-black text-slate-900">{formatINR(p.amount)}</td>
                <td className="py-3.5 px-4"><PaymentStatusBadge status={p.paymentStatus} /></td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/dashboard/invoices/${p.bookingId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>GST Invoice</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
