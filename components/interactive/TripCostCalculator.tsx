'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Plane,
  Car,
  Users,
  Fuel,
  CreditCard,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface RoutePreset {
  id: string;
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  driveTime: string;
  terrain: string;
  recommendedCar: string;
  carDailyRate: number;
  carMileageKmPerLitre: number;
  flightTicketCostPerPerson: number;
  tollEstimate: number;
}

const POPULAR_ROUTES: RoutePreset[] = [
  {
    id: 'blr-coorg',
    name: 'Bengaluru ➔ Coorg & Chikmagalur',
    from: 'Bengaluru',
    to: 'Coorg Hills',
    distanceKm: 260,
    driveTime: '5.5 hrs',
    terrain: 'Coffee plantation hairpins & misty ghats',
    recommendedCar: 'Mahindra Thar 4x4',
    carDailyRate: 4500,
    carMileageKmPerLitre: 12,
    flightTicketCostPerPerson: 5800,
    tollEstimate: 420
  },
  {
    id: 'del-manali',
    name: 'Delhi NCR ➔ Manali & Solang Valley',
    from: 'Delhi NCR',
    to: 'Manali, Himachal',
    distanceKm: 540,
    driveTime: '10.5 hrs',
    terrain: 'Himalayan expressway & mountain curves',
    recommendedCar: 'Toyota Fortuner 4x4',
    carDailyRate: 8500,
    carMileageKmPerLitre: 10,
    flightTicketCostPerPerson: 8500,
    tollEstimate: 880
  },
  {
    id: 'bom-goa',
    name: 'Mumbai ➔ Goa Coastal Highway',
    from: 'Mumbai',
    to: 'Goa (North/South)',
    distanceKm: 580,
    driveTime: '9.5 hrs',
    terrain: 'Konkan scenic coastal expressway',
    recommendedCar: 'Hyundai Creta SX (O)',
    carDailyRate: 3400,
    carMileageKmPerLitre: 16,
    flightTicketCostPerPerson: 6200,
    tollEstimate: 760
  },
  {
    id: 'hyd-hampi',
    name: 'Hyderabad ➔ Hampi Heritage Trail',
    from: 'Hyderabad',
    to: 'Hampi, Karnataka',
    distanceKm: 380,
    driveTime: '7.0 hrs',
    terrain: 'Smooth 4-lane NH highways & boulder vistas',
    recommendedCar: 'Toyota Innova Crysta (7-Seater)',
    carDailyRate: 4200,
    carMileageKmPerLitre: 13,
    flightTicketCostPerPerson: 6900,
    tollEstimate: 510
  }
];

export default function TripCostCalculator() {
  const [selectedRouteId, setSelectedRouteId] = useState('blr-coorg');
  const [passengerCount, setPassengerCount] = useState(4);
  const [tripDays, setTripDays] = useState(3);

  const route = POPULAR_ROUTES.find(r => r.id === selectedRouteId) || POPULAR_ROUTES[0];

  // Calculations
  const roundTripDistance = route.distanceKm * 2;
  const fuelLitres = roundTripDistance / route.carMileageKmPerLitre;
  const estimatedFuelPricePerLitre = 98; // Average diesel/petrol price INR
  const totalFuelCost = Math.round(fuelLitres * estimatedFuelPricePerLitre);
  const totalCarRental = route.carDailyRate * tripDays;
  const totalToll = route.tollEstimate * 2;
  const selfDriveTotal = totalCarRental + totalFuelCost + totalToll;

  // Comparison: Commercial Flights + Local cabs at destination
  const flightTicketsTotal = route.flightTicketCostPerPerson * passengerCount;
  const localCabExpensesAtDestination = 3500 * tripDays; // Local outstation cab hire
  const airportTransferCabs = 2400; // Both origins
  const alternativeTotal = flightTicketsTotal + localCabExpensesAtDestination + airportTransferCabs;

  const netSavings = Math.max(0, alternativeTotal - selfDriveTotal);
  const perPersonCost = Math.round(selfDriveTotal / passengerCount);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Live Road Trip Math</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Why Fly When You Can <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Drive Together & Save Thousands?
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Compare actual expenses: Flight tickets + airport cabs vs. a sanitized RentaRide self-drive car with unlimited luggage and complete roadside freedom.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="bg-slate-950/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-800">
            {/* Route Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select Holiday Highway</span>
              </label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {POPULAR_ROUTES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.distanceKm} km)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Terrain: {route.terrain}
              </p>
            </div>

            {/* Passenger Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Travelers / Passengers</span>
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 4, 6, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPassengerCount(num)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition ${
                      passengerCount === num
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                {passengerCount > 4 ? 'Requires 7-Seater MPV / Large SUV' : 'Ideal for Hatchback or Compact SUV'}
              </p>
            </div>

            {/* Trip Duration Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trip Duration</span>
              </label>
              <div className="flex items-center gap-3">
                {[2, 3, 4, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTripDays(days)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition ${
                      tripDays === days
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                Round-trip: {roundTripDistance} km total drive
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-stretch">
            {/* Flight / Commercial Alternative (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-slate-400" />
                    <span className="font-extrabold text-sm text-slate-300">Airlines + Local Taxi Hire</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Conventional Way
                  </span>
                </div>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Flight Tickets ({passengerCount} × {formatINR(route.flightTicketCostPerPerson)})</span>
                    <span className="font-bold text-slate-200">{formatINR(flightTicketsTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Airport Cabs (To & From Airports)</span>
                    <span className="font-bold text-slate-200">{formatINR(airportTransferCabs)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Local Outstation Taxi ({tripDays} days)</span>
                    <span className="font-bold text-slate-200">{formatINR(localCabExpensesAtDestination)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Luggage Excess & Cancellation Fees</span>
                    <span className="text-amber-400 font-semibold">Strict 15kg limits</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Total Conventional Expense</p>
                <p className="text-2xl font-black text-slate-400 line-through mt-0.5">
                  {formatINR(alternativeTotal)}
                </p>
              </div>
            </div>

            {/* RentaRide Self-Drive (7 cols - Spotlight Hero Card) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-xl flex flex-col justify-between relative overflow-hidden">
              {/* Corner badge */}
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase px-4 py-1 rounded-bl-2xl shadow-md">
                Smart Traveler Pick
              </div>

              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/50">
                  <Car className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-base text-white">
                    RentaRide Self-Drive ({route.recommendedCar})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-3 bg-slate-950/60 rounded-2xl p-3 border border-emerald-900/40 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Car Rental ({tripDays}d)</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{formatINR(totalCarRental)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Fuel ({roundTripDistance}km)</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{formatINR(totalFuelCost)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">FASTag Tolls</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{formatINR(totalToll)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Zero Luggage Stress:</strong> Fit full adventure gear, baby strollers & trekking tents.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Highway Freedom:</strong> Stop at iconic roadside tea stalls whenever you like.</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">All-Inclusive Self-Drive Expense</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-white">{formatINR(selfDriveTotal)}</p>
                    <span className="text-xs font-bold text-emerald-400">
                      ({formatINR(perPersonCost)} / person)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold mb-2">
                    You Save {formatINR(netSavings)}
                  </div>
                  <div>
                    <Link
                      href="/dashboard/bookings/new"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Book Road Trip Car</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
