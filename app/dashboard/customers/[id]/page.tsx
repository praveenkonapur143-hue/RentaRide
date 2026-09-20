'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  History,
  AlertTriangle,
  FileText,
  DollarSign,
  Plus
} from 'lucide-react';
import { Badge, BookingStatusBadge, CustomerStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${params.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.customer) setData(d);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading customer profile...</div>;
  }

  if (!data?.customer) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-slate-800">Customer not found</p>
        <Link href="/dashboard/customers" className="text-xs font-bold text-blue-600 hover:underline">
          Back to customers
        </Link>
      </div>
    );
  }

  const { customer, bookings = [], payments = [], damageReports = [], outstandingBalance = 0 } = data;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customers"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{customer.fullName}</h1>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Customer ID: {customer.id} • Registered {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/bookings/new?customerId=${customer.id}`}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking for Customer</span>
        </Link>
      </div>

      {/* Profile Overview & Outstanding Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Identity Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Driver & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Email Address</span>
                <p className="font-semibold text-slate-800">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Phone Number</span>
                <p className="font-semibold text-slate-800 font-mono">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Driving Licence</span>
                <p className="font-bold text-slate-800 font-mono">{customer.drivingLicenceNumber}</p>
                <p className="text-[10px] text-slate-400">Expires: {customer.licenceExpiryDate || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Aadhaar / PAN Card</span>
                <p className="font-semibold text-slate-800 font-mono">{customer.governmentIdNumber || '—'}</p>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Address</span>
                <p className="font-medium text-slate-700">{customer.address || 'No physical address provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance & Ledger Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 mb-2">Financial Balance</h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 my-3">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Outstanding Balance Due</span>
              <p className="text-3xl font-black text-amber-700 mt-1">{formatINR(outstandingBalance)}</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {outstandingBalance > 0 ? 'Pending invoice settlement' : 'Account in good standing'}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Bookings:</span>
              <span className="font-bold text-slate-800">{bookings.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payments Recorded:</span>
              <span className="font-bold text-slate-800">{payments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Damage Claims:</span>
              <span className="font-bold text-rose-600">{damageReports.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Rental History & Bookings</h2>
        </div>
        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No bookings on record for this customer.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
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
                    <td className="py-3.5 px-4 font-medium text-slate-800">{b.days}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatINR(b.totalAmount)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{formatINR(b.advancePayment)}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{formatINR(b.balanceAmount)}</td>
                    <td className="py-3.5 px-4"><BookingStatusBadge status={b.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/dashboard/bookings/${b.id}`} className="font-bold text-emerald-600 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Damage Reports Table if any */}
      {damageReports.length > 0 && (
        <div className="bg-white rounded-3xl border border-rose-200/80 shadow-sm overflow-hidden p-6 space-y-3">
          <h2 className="text-sm font-extrabold text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Customer Damage Incident Reports</span>
          </h2>
          <div className="space-y-3">
            {damageReports.map((d: any) => (
              <div key={d.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-rose-800">{d.reportNumber} - {d.damageType}</span>
                  <p className="text-slate-700 mt-1">{d.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">{formatINR(d.finalCharge)} Charged</span>
                  <p className="text-[10px] text-slate-500">Status: {d.repairStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
