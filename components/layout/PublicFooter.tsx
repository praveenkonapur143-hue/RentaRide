import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, Clock, Award, FileText } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 md:pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Renta<span className="text-emerald-500">Ride</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India’s premier self-drive car rental network. Unlimited kilometres, zero paperwork, FASTag-enabled cars, and doorstep delivery across major Indian metros.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> GST & RC Verified</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-400" /> 24/7 Roadside</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Top Self-Drive Cities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#vehicles" className="hover:text-white transition">Self-Drive Cars in Bengaluru</Link></li>
              <li><Link href="/#vehicles" className="hover:text-white transition">Self-Drive Cars in Delhi NCR</Link></li>
              <li><Link href="/#vehicles" className="hover:text-white transition">Self-Drive Cars in Mumbai</Link></li>
              <li><Link href="/#vehicles" className="hover:text-white transition">Mahindra Thar 4x4 in Goa</Link></li>
              <li><Link href="/#vehicles" className="hover:text-white transition">Self-Drive Cars in Hyderabad</Link></li>
              <li><Link href="/#vehicles" className="hover:text-white transition">Self-Drive Cars in Pune</Link></li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Policies & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Motor Vehicles Act (1988/2019) Terms</a></li>
              <li><a href="#" className="hover:text-white transition">RentaRide Shield Damage Waiver</a></li>
              <li><a href="#" className="hover:text-white transition">FASTag Toll Policy & Deductions</a></li>
              <li><a href="#" className="hover:text-white transition">Speed Governor (80-100 km/h) Rules</a></li>
              <li><a href="#" className="hover:text-white transition">DigiLocker & Aadhaar Verification</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">India Headquarters</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cyber One Building, Sector 30, Gurugram, Delhi NCR 122001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 1800 209 7433 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@rentaride.in</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                <span>GSTIN: 07AAAAA1234A1Z5 (SAC 9966)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentaRide Mobility Solutions Pvt. Ltd. “Never Stop Living.”</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-emerald-400 transition font-medium">Host / Staff Portal</Link>
            <a href="#" className="hover:text-white transition">DigiLocker Verification</a>
            <a href="#" className="hover:text-white transition">Fleet Network</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
