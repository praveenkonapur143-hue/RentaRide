'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Globe,
  Sparkles,
  Lock,
  Clock,
  ArrowRight,
  CheckCircle,
  Copy,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { formatINR } from '@/lib/currency';
import DigitalBoardingPass from './DigitalBoardingPass';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    registrationNumber: string;
    dailyPrice: number;
    securityDeposit: number;
    fuelType: string;
    images?: { url: string }[];
  };
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    drivingLicenceNumber?: string;
  };
  bookingParams?: {
    pickupDate?: string;
    returnDate?: string;
    days?: number;
    plan?: string;
    deliveryMode?: string;
    city?: string;
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  vehicle,
  customer,
  bookingParams = {}
}: PaymentModalProps) {
  const days = bookingParams.days || 2;
  const plan = bookingParams.plan || 'STANDARD';
  const deliveryMode = bookingParams.deliveryMode || 'HUB';
  const city = bookingParams.city || 'Bengaluru';
  const pickupDate = bookingParams.pickupDate || new Date().toISOString().split('T')[0];
  const returnDate = bookingParams.returnDate || new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Pricing math
  const baseRental = vehicle.dailyPrice * days;
  const planFee = plan === 'PEACE_OF_MIND' ? 350 * days : 0;
  const deliveryFee = deliveryMode === 'DOORSTEP' ? 300 : 0;
  const subtotal = baseRental + planFee + deliveryFee;
  const gstAmount = Math.round(subtotal * 0.18);
  const securityDeposit = vehicle.securityDeposit || 3000;
  const totalAmount = subtotal + gstAmount + securityDeposit;

  // Active payment gateway tab
  const [activeTab, setActiveTab] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'PAYPAL'>('UPI');

  // Customer details - initialized from props or defaults
  const [customerName, setCustomerName] = useState(customer?.name || 'Aarav Sharma');
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '+91 98450 12399');
  const [customerEmail, setCustomerEmail] = useState(customer?.email || 'aarav.sharma@example.in');
  const [drivingLicence, setDrivingLicence] = useState(customer?.drivingLicenceNumber || 'KA-0520190089123');

  // Keep customer details synced if customer prop changes or fetch from session
  useEffect(() => {
    if (customer?.name) setCustomerName(customer.name);
    if (customer?.phone) setCustomerPhone(customer.phone);
    if (customer?.email) setCustomerEmail(customer.email);
    if (customer?.drivingLicenceNumber) setDrivingLicence(customer.drivingLicenceNumber);

    if (!customer?.name && isOpen) {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((data) => {
          if (data?.user?.name) {
            setCustomerName(data.user.name);
            setCustomerEmail(data.user.email);
            if (data.user.phone) setCustomerPhone(data.user.phone);
          }
        })
        .catch(() => {});
    }
  }, [customer, isOpen]);

  // Payment UI state
  const [loading, setLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(599); // 10 minutes
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmedPass, setConfirmedPass] = useState<any>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // NetBanking bank choice
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Timer countdown
  useEffect(() => {
    if (!isOpen || confirmedPass) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, confirmedPass]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('rentaride.razorpay@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      setCardExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Submit payment handler
  const handleProcessPayment = async () => {
    if (activeTab === 'CARD' && !showOtpModal) {
      // Trigger 3D Secure simulation
      setShowOtpModal(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          days,
          plan,
          deliveryMode
        })
      });
      const orderData = await orderRes.json();
      const razorpayOrderId = orderData.order?.id || `order_${Date.now()}`;

      // 2. Verify payment
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          paymentMethod: activeTab,
          vehicleId: vehicle.id,
          customerId: customer?.id,
          customerName,
          customerEmail,
          customerPhone,
          drivingLicenceNumber: drivingLicence,
          pickupDate,
          returnDate,
          days,
          pickupLocation: `${city} Central Transit Hub`,
          deliveryMode,
          plan,
          totalAmount
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success && verifyData.boardingPass) {
        setShowOtpModal(false);
        setConfirmedPass(verifyData.boardingPass);
      } else {
        alert(verifyData.error || 'Payment could not be completed');
      }
    } catch (err: any) {
      alert(err.message || 'Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-0 sm:my-8 max-h-[95vh] sm:max-h-none flex flex-col">
        {/* If Confirmed, render Boarding Pass */}
        {confirmedPass ? (
          <div>
            <DigitalBoardingPass
              passData={confirmedPass}
              onClose={() => {
                setConfirmedPass(null);
                onClose();
              }}
            />
          </div>
        ) : (
          /* Payment Modal Container */
          <div className="bg-slate-900 border border-slate-800 rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[92vh] sm:max-h-none">
            {/* Mobile Bottom Sheet Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center bg-slate-950">
              <div className="w-12 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-lg font-black text-white">
                      Razorpay Secure Checkout
                    </h2>
                    <span className="hidden xs:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      256-BIT ENCRYPTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 sm:line-clamp-none">
                    Direct instant settlement with UPI & FASTag Gateway
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] sm:text-xs font-mono font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-90 transition"
                  aria-label="Close Checkout"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Grid */}
            <div className="overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 pb-safe">
              {/* Left Column: Payment Methods (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-8 space-y-5 sm:space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Gateway Tab Selectors */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('UPI')}
                    className={`py-2.5 rounded-xl transition flex flex-col items-center gap-1 ${
                      activeTab === 'UPI'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px]">UPI / QR</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('CARD')}
                    className={`py-2.5 rounded-xl transition flex flex-col items-center gap-1 ${
                      activeTab === 'CARD'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px]">Cards</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('NETBANKING')}
                    className={`py-2.5 rounded-xl transition flex flex-col items-center gap-1 ${
                      activeTab === 'NETBANKING'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[11px]">NetBanking</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('PAYPAL')}
                    className={`py-2.5 rounded-xl transition flex flex-col items-center gap-1 ${
                      activeTab === 'PAYPAL'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-[11px]">PayPal</span>
                  </button>
                </div>

                {/* TAB 1: UPI / QR */}
                {activeTab === 'UPI' && (
                  <div className="space-y-5">
                    {/* QR Code Card */}
                    <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 text-center relative overflow-hidden">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mb-3">
                        <span>SCAN VIA ANY UPI APP</span>
                      </div>

                      {/* Stylized QR Box */}
                      <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center relative group">
                        <QrCode className="w-36 h-36 text-slate-900" />
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-[1px]">
                          <span className="bg-slate-950 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                            Valid for 10 mins
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-bold mt-3">
                        Scan with GPay, PhonePe, Paytm, Cred or BHIM
                      </p>

                      {/* Copy UPI ID Pill */}
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono">
                        <span className="text-slate-400">UPI ID:</span>
                        <span className="text-white font-bold">rentaride.razorpay@icici</span>
                        <button
                          onClick={handleCopyUpi}
                          className="ml-1 text-emerald-400 hover:text-emerald-300 transition"
                        >
                          {copiedUpi ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Instant App Deep-Link Buttons */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Or Pay Directly Using Installed App
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { name: 'Google Pay', icon: '🟢' },
                          { name: 'PhonePe', icon: '🟣' },
                          { name: 'Paytm UPI', icon: '🔵' },
                          { name: 'Cred UPI', icon: '⚫' }
                        ].map((app) => (
                          <button
                            key={app.name}
                            type="button"
                            onClick={handleProcessPayment}
                            className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5 group"
                          >
                            <span>{app.icon}</span>
                            <span className="group-hover:text-white">{app.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARDS */}
                {activeTab === 'CARD' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on Card"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Card Number
                        </label>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          RuPay / Visa / Mastercard
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          CVV Code
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-widest"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Zero liability for unauthorized charges with 3D Secure 2.0</span>
                    </p>
                  </div>
                )}

                {/* TAB 3: NETBANKING */}
                {activeTab === 'NETBANKING' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Popular Retail Banks
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { code: 'HDFC', name: 'HDFC Bank' },
                        { code: 'ICICI', name: 'ICICI Bank' },
                        { code: 'SBI', name: 'State Bank of India' },
                        { code: 'AXIS', name: 'Axis Bank' },
                        { code: 'KOTAK', name: 'Kotak Mahindra' },
                        { code: 'PNB', name: 'Punjab National' }
                      ].map((b) => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => setSelectedBank(b.code)}
                          className={`p-3 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${
                            selectedBank === b.code
                              ? 'bg-emerald-950/40 border-emerald-500 text-white shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{b.name}</span>
                          {selectedBank === b.code && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: PAYPAL (International) */}
                {activeTab === 'PAYPAL' && (
                  <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-black text-white">
                      International Travelers & NRI Booking
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Pay using your International Credit Card or PayPal balance in USD ($). Currency conversion applied automatically at live market rates.
                    </p>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 inline-block font-mono text-xs">
                      Estimated USD: <strong className="text-emerald-400">${Math.round(totalAmount / 84)} USD</strong> (at ₹84/$1)
                    </div>
                  </div>
                )}

                {/* Driver Identity Verification Summary */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Primary Driver Details
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Aadhaar / Licence OK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile Number"
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Fare Breakdown & CTA (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-8 bg-slate-950/60 flex flex-col justify-between space-y-6">
                <div>
                  <div className="pb-4 border-b border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide">
                      Selected Self-Drive Vehicle
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-mono text-amber-300 font-bold">{vehicle.registrationNumber}</span>
                      <span>•</span>
                      <span>{days} Days Self-Drive</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown Line Items */}
                  <div className="space-y-2.5 mt-5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Base Rental ({days} days × {formatINR(vehicle.dailyPrice)})</span>
                      <span className="font-bold text-white">{formatINR(baseRental)}</span>
                    </div>

                    {planFee > 0 && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Peace of Mind Zero-Liability</span>
                        <span className="font-bold text-emerald-400">{formatINR(planFee)}</span>
                      </div>
                    )}

                    {deliveryFee > 0 && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Doorstep Sanitized Delivery</span>
                        <span className="font-bold text-white">{formatINR(deliveryFee)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-400">
                      <span>GST (18% - SAC Code 9966)</span>
                      <span className="font-bold text-white">{formatINR(gstAmount)}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 pb-3 border-b border-slate-800">
                      <div>
                        <span>Refundable Security Deposit</span>
                        <span className="block text-[10px] text-emerald-400">
                          Released to original UPI in 2 hrs
                        </span>
                      </div>
                      <span className="font-bold text-emerald-400">{formatINR(securityDeposit)}</span>
                    </div>

                    <div className="pt-2 flex items-baseline justify-between">
                      <span className="text-sm font-extrabold text-white">Total Payable Now</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {formatINR(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Payment Action Button */}
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleProcessPayment}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Verifying with Razorpay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {formatINR(totalAmount)} Securely</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    By confirming payment, you agree to the MV Act 2019 self-drive terms and speed limiter compliance (80-100 km/h).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Secure OTP Simulation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                Bank 3D Secure Verification
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the simulated 6-digit OTP sent to {customerPhone} to authorize payment of {formatINR(totalAmount)}.
              </p>
            </div>

            <div className="flex justify-center">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-48 py-3 text-center text-2xl font-mono font-black tracking-widest rounded-2xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleProcessPayment}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
              >
                {loading ? 'Authorizing...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
