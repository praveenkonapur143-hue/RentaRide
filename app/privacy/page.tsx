import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, FileText, Smartphone, Mail } from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Privacy Policy • RentaRide Self-Drive Rentals',
  description: 'Learn how RentaRide collects, uses, protects, and stores customer information in compliance with Indian IT laws and Google Play safety standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & Privacy Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy & Data Safety
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Last Updated: September 21, 2026 • Compliant with Motor Vehicles Act 1988/2019, Information Technology Act 2000, and Google Play Store Developer Policies.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use <strong>RentaRide</strong> (via web or mobile app) to reserve a self-drive vehicle, we collect necessary personal information to comply with Government of India transport regulations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Contact Information:</strong> Full legal name, email address, mobile phone number.</li>
              <li><strong>Driver Credentials:</strong> Indian Driving Licence (DL) number, issue/expiry dates, and optional DigiLocker KYC verification for identity validation.</li>
              <li><strong>Trip & Booking Data:</strong> Pickup and return dates, chosen city/hub, selected KM package, and protection plan preferences.</li>
              <li><strong>Device & Telemetry:</strong> Device model, operating system, and approximate location during contactless keyless Bluetooth unlock.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              2. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate self-drive rental services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Validating legal eligibility to drive motor vehicles under the Motor Vehicles Act (1988/2019).</li>
              <li>Generating your verified Digital Boarding Pass, Rental Agreement, and 18% GST tax invoices (SAC 9966).</li>
              <li>Processing toll reconciliations through vehicle FASTag electronic toll systems.</li>
              <li>Sending transactional notifications regarding booking confirmation, cancellation refunds, and trip reminders.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              3. Payment Security & Third-Party Processors
            </h2>
            <p>
              RentaRide uses certified, bank-grade payment gateways (including <strong>Razorpay</strong>, UPI, and authorized NetBanking networks). All payment transactions are protected by <strong>256-bit TLS/SSL encryption</strong>. RentaRide <em>never</em> stores full credit card numbers, debit card PINs, or UPI MPINs on its servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              4. Data Retention & Deletion Rights
            </h2>
            <p>
              In compliance with Google Play Store Data Safety guidelines, you have the right to request access to or permanent deletion of your customer account and personal data.
            </p>
            <p>
              To request account and data deletion, email our Data Protection Officer at{' '}
              <a href="mailto:privacy@rentaride.in" className="text-emerald-400 hover:underline font-bold">
                privacy@rentaride.in
              </a>
              . All personal identifiers will be purged within 14 business days, except records required to be retained under statutory Indian taxation and motor vehicle laws.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              5. Contact Us
            </h2>
            <p>If you have questions regarding this Privacy Policy or our mobile application, contact us at:</p>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">RentaRide Mobility Solutions Pvt. Ltd.</p>
              <p>Cyber One Building, Sector 30, Gurugram, Delhi NCR 122001, India</p>
              <p>Email: <a href="mailto:support@rentaride.in" className="text-emerald-400 font-bold">support@rentaride.in</a> | Phone: +91 1800 209 7433</p>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
