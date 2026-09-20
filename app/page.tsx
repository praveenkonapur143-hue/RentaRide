'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Truck,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Headphones,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Star,
  Fuel,
  Users,
  Gauge,
  Zap,
  Clock,
  Home,
  Navigation,
  Compass,
  Lock
} from 'lucide-react';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { initialVehicles } from '@/lib/demo-data';
import { formatINR, POPULAR_INDIAN_HUBS, KM_PACKAGES } from '@/lib/currency';

// Anti-AI Bespoke Interactive Components
import RoadTripTicker from '@/components/interactive/RoadTripTicker';
import CarStudioVisualizer from '@/components/interactive/CarStudioVisualizer';
import SpeedometerShowcase from '@/components/interactive/SpeedometerShowcase';
import ContactlessTripSteps from '@/components/interactive/ContactlessTripSteps';
import TripCostCalculator from '@/components/interactive/TripCostCalculator';
import LiveHubRadar from '@/components/interactive/LiveHubRadar';
import DynamicTripIsland from '@/components/interactive/DynamicTripIsland';
import PaymentModal from '@/components/payment/PaymentModal';

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [searchHub, setSearchHub] = useState('Kempegowda Airport (BLR) T1/T2');
  const [deliveryType, setDeliveryType] = useState<'HUB' | 'DOORSTEP'>('HUB');
  const [pickupDate, setPickupDate] = useState('2026-10-01');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-04');
  const [returnTime, setReturnTime] = useState('18:00');

  // Checkout modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedVehicleForPayment, setSelectedVehicleForPayment] = useState<any>(initialVehicles[0]);

  const currentCityHubs = POPULAR_INDIAN_HUBS.find(c => c.city === selectedCity)?.hubs || POPULAR_INDIAN_HUBS[0].hubs;

  const categories = [
    { id: 'ALL', name: 'All Cars', icon: Car },
    { id: 'HATCHBACK', name: 'Hatchbacks', icon: Car },
    { id: 'SEDAN', name: 'Sedans', icon: Car },
    { id: 'SUV', name: 'SUVs & 4x4', icon: Compass },
    { id: 'MPV', name: '7-Seaters & MPVs', icon: Users },
    { id: 'LUXURY', name: 'Luxury Cars', icon: Sparkles },
  ];

  const filteredVehicles = selectedCategory === 'ALL'
    ? initialVehicles
    : initialVehicles.filter(v => {
        if (selectedCategory === 'HATCHBACK') return v.type === 'HATCHBACK' || (v.type as any) === 'CAR';
        if (selectedCategory === 'SEDAN') return v.type === 'SEDAN';
        if (selectedCategory === 'SUV') return v.type === 'SUV';
        if (selectedCategory === 'MPV') return v.type === 'MPV';
        if (selectedCategory === 'LUXURY') return v.type === 'LUXURY';
        return v.type === selectedCategory;
      });

  const handleOpenCheckout = (vehicleId: string) => {
    const v = initialVehicles.find(item => item.id === vehicleId) || initialVehicles[0];
    setSelectedVehicleForPayment(v);
    setPaymentModalOpen(true);
  };

  const testimonials = [
    {
      name: 'Aarav Sharma',
      role: 'Tech Lead, Bengaluru',
      rating: 5,
      car: 'Mahindra Thar 4x4',
      comment: 'Booked the Thar 4x4 from Kempegowda Airport for a 4-day road trip to Coorg. The car was pristine, FASTag worked seamlessly at every toll, and returning took barely 2 minutes with digital photo check-in.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      name: 'Priya Patel',
      role: 'Product Manager, Mumbai',
      rating: 5,
      car: 'Hyundai Creta Automatic',
      comment: 'Selected Doorstep Delivery in Worli for a weekend drive to Mahabaleshwar. The peace of mind damage waiver gave total confidence. Deposit was credited back to my UPI within 2 hours of trip completion!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
    },
    {
      name: 'Rahul Verma',
      role: 'Corporate Consultant, Gurugram',
      rating: 5,
      car: 'Toyota Fortuner Legender',
      comment: 'Top tier self-drive experience in Delhi NCR. Proper GST tax invoice with SAC 9966 for corporate reimbursement, clean car, and full tank at pickup. Way better than conventional rentals.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      {/* Live Dispatches Ticker */}
      <RoadTripTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white pt-20 pb-32">
        {/* Background glow & accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>India’s Leading Self-Drive Mobility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Self-Drive Car Rentals <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                  Across 8+ Indian Cities.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Drive anywhere from city commutes to outstation hill roads. Verified fleet of Swift, Baleno, Creta, Mahindra Thar 4x4, and Innova Crysta with <strong>Unlimited Kms</strong> & <strong>Doorstep Delivery</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/dashboard/bookings/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 hover:shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Book a Self-Drive Car</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenCheckout(initialVehicles[2]?.id || 'veh-03')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Instant Razorpay Checkout</span>
                </button>
              </div>

              {/* Key USPs */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">FASTag</p>
                  <p className="text-xs text-slate-400 font-medium">Automatic Toll Clearance</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">Unlimited</p>
                  <p className="text-xs text-slate-400 font-medium">Kilometres Packages</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">24x7</p>
                  <p className="text-xs text-slate-400 font-medium">Roadside Assistance</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800">
                  <img
                    src="/images/cars/thar.jpg"
                    alt="Mahindra Thar 4x4 Adventure"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="inline-block px-3 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-full w-max shadow-md uppercase tracking-wider">
                      Goa & Mountain Favorite
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">Mahindra Thar LX Hard Top 4x4</h3>
                    <p className="text-xs text-slate-300">Diesel 4WD • 4.97 ★ (215 trips) • From ₹4,500/day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Trip Search Bar */}
      <section className="-mt-14 relative z-20 max-w-6xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
          {/* Delivery Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('HUB')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  deliveryType === 'HUB'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Pickup from Airport / Metro Hub</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('DOORSTEP')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  deliveryType === 'DOORSTEP'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Doorstep Delivery (Home / Hotel)</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free Cancellation up to 24 hrs before trip</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City & Hub */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                City & Pickup Location
              </label>
              <div className="space-y-2">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    const hubs = POPULAR_INDIAN_HUBS.find(c => c.city === e.target.value)?.hubs;
                    if (hubs && hubs.length > 0) setSearchHub(hubs[0]);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {POPULAR_INDIAN_HUBS.map(c => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>

                <select
                  value={searchHub}
                  onChange={(e) => setSearchHub(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currentCityHubs.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pickup Date & Time */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Trip Start Date & Time
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Return Date & Time */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Trip Return Date & Time
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Search CTA */}
            <div className="flex flex-col justify-end">
              <Link
                href={`/dashboard/bookings/new?pickupDate=${pickupDate}&returnDate=${returnDate}&location=${encodeURIComponent(`${selectedCity} - ${searchHub}`)}&delivery=${deliveryType}`}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Find Cars in {selectedCity}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Showstopper: Interactive Car Studio */}
      <CarStudioVisualizer onQuickCheckout={(vId) => handleOpenCheckout(vId)} />

      {/* Automotive Telemetry & Dynamic Gauge Engine */}
      <SpeedometerShowcase />

      {/* Category Filter Bar & Catalog */}
      <section className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60">
            Wide Range of Self-Drive Vehicles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Explore India’s Most Loved Cars
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Every car is sanitized, FASTag fitted, and verified with up-to-date RC, Insurance, and PUC certificates.
          </p>
        </div>

        {/* Category Badges */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition transform active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Vehicle Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredVehicles.map((vehicle) => {
            const isAvailable = vehicle.status === 'AVAILABLE';

            return (
              <div
                key={vehicle.id}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Status Badge */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.images[0]?.url || '/images/cars/swift.jpg'}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status & FASTag Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900/80 text-white backdrop-blur-sm'
                        }`}
                      >
                        {isAvailable ? 'Instant Booking' : vehicle.status.replace('_', ' ')}
                      </span>

                      {vehicle.fastagEnabled && (
                        <span className="text-[10px] font-extrabold px-2 py-1 rounded-full shadow-md bg-blue-600 text-white uppercase">
                          FASTag
                        </span>
                      )}
                    </div>

                    {/* Star Rating & Trips */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-white text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{vehicle.rating || 4.9}</span>
                      <span className="text-[10px] text-slate-300">({vehicle.tripsCount || 100}+)</span>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                          {vehicle.brand} • {vehicle.year}
                        </p>
                        <h3 className="text-base font-black text-slate-900 mt-0.5 group-hover:text-emerald-600 transition">
                          {vehicle.model}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        {vehicle.registrationNumber}
                      </span>
                    </div>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-slate-600 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vehicle.seatingCapacity} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        <span className="capitalize">{vehicle.transmission.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-slate-400" />
                        <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">
                          {formatINR(vehicle.dailyPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">/day</span>
                      </div>
                      {vehicle.hourlyRate && (
                        <p className="text-[10px] text-emerald-700 font-bold">
                          {formatINR(vehicle.hourlyRate)}/hr
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(vehicle.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      {isAvailable ? 'Book with Razorpay' : 'Booked Out'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Road Trip vs Flight Fare Calculator */}
      <TripCostCalculator />

      {/* Why Choose RentaRide Features */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100/60 px-3.5 py-1 rounded-full">
              The Self-Drive Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Why Indians Prefer Our Self-Drive Fleet
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Freedom of driving your own car without maintenance, EMI, or insurance hassles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Unlimited Kilometres</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take road trips to Goa, Ladakh, or Coorg without constantly watching the odometer. Zero km restrictions with our unlimited packages.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Doorstep Delivery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get your sanitized car delivered directly outside your home or hotel. Ready to drive with keys handed over punctually.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">FASTag Toll Ready</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every vehicle has a pre-loaded FASTag. Cruise through toll plazas across India without cash or queue delays.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">DigiLocker & Aadhaar KYC</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paperless driver onboarding via Aadhaar and DigiLocker Driving Licence. Verified in under 3 minutes with zero physical paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transit Radar & Hub Telemetry */}
      <LiveHubRadar onSelectHubCity={(city) => setSelectedCity(city)} />

      {/* 3-Step Contactless Journey with Interactive Bluetooth Unlock */}
      <ContactlessTripSteps />

      {/* Customer Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full">
              Verified Self-Drive Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Loved by Over 50,000+ Drivers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full uppercase">
                    Rented {t.car}
                  </span>
                  <p className="text-slate-700 text-sm mt-3 leading-relaxed">
                    “{t.comment}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Drive? Book in 60 Seconds.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Choose your city, pick a car, upload your driving licence, and hit the road.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard/bookings/new"
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition transform active:scale-95"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Dynamic Booking Island */}
      <DynamicTripIsland
        selectedVehicle={selectedVehicleForPayment}
        city={selectedCity}
        onOpenCheckout={() => setPaymentModalOpen(true)}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        vehicle={selectedVehicleForPayment}
        bookingParams={{
          city: selectedCity,
          pickupDate,
          returnDate,
          deliveryMode: deliveryType,
          plan: 'STANDARD'
        }}
      />

      <PublicFooter />
    </div>
  );
}
