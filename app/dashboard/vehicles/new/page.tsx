'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, Upload, Save, Check } from 'lucide-react';

export default function NewVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    registrationNumber: '',
    type: 'HATCHBACK',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    seatingCapacity: 5,
    dailyPrice: 2499,
    securityDeposit: 3000,
    odometerReading: 0,
    status: 'AVAILABLE',
    insuranceExpiryDate: '',
    registrationExpiryDate: '',
    pollutionExpiryDate: '',
    imageUrl: '/images/cars/swift.jpg',
    notes: '',
  });

  const sampleImages = [
    { label: 'Maruti Suzuki Swift', url: '/images/cars/swift.jpg' },
    { label: 'Maruti Suzuki Baleno', url: '/images/cars/baleno.jpg' },
    { label: 'Mahindra Thar 4x4', url: '/images/cars/thar.jpg' },
    { label: 'Tata Nexon', url: '/images/cars/nexon.jpg' },
    { label: 'Toyota Innova Crysta', url: '/images/cars/innova.jpg' },
    { label: 'Mahindra Scorpio-N', url: '/images/cars/scorpio.jpg' },
    { label: 'Tata Tiago EV', url: '/images/cars/tiago.jpg' },
    { label: 'Honda City', url: '/images/cars/city.jpg' },
    { label: 'Toyota Fortuner Legender', url: '/images/cars/fortuner.jpg' },
    { label: 'Hyundai Creta', url: '/images/cars/creta.png' },
    { label: 'Kia Seltos', url: '/images/cars/seltos.jpg' },
    { label: 'Volkswagen Virtus GT', url: '/images/cars/virtus.png' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(String(formData.year)),
        seatingCapacity: parseInt(String(formData.seatingCapacity)),
        dailyPrice: parseFloat(String(formData.dailyPrice)),
        securityDeposit: parseFloat(String(formData.securityDeposit)),
        odometerReading: parseInt(String(formData.odometerReading)),
        images: [
          {
            id: `img-${Date.now()}`,
            url: formData.imageUrl,
            caption: `${formData.brand} ${formData.model}`,
            isPrimary: true,
          }
        ]
      };

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to create vehicle');
        setLoading(false);
        return;
      }

      router.push('/dashboard/vehicles');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Submission error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/vehicles"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Fleet Vehicle</h1>
            <p className="text-xs text-slate-500">Enter vehicle specifications, pricing, compliance, and photos.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Specifications Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Car className="w-5 h-5 text-blue-600" />
            <span>Vehicle Identity & Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registration Plate Number *
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. DL 01 AB 1234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vehicle Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              >
                <option value="HATCHBACK">Hatchback</option>
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV & 4x4</option>
                <option value="MPV">7-Seater / MPV</option>
                <option value="LUXURY">Luxury Car</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand / Make *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Maruti Suzuki, Mahindra, Hyundai, Tata"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Model *
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Swift, Thar 4x4, Creta, Nexon, Fortuner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturing Year *
              </label>
              <input
                type="number"
                required
                min={2000}
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fuel Type *
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="CNG">CNG / Bi-Fuel</option>
                <option value="ELECTRIC">Electric (EV)</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transmission *
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Seating Capacity *
              </label>
              <input
                type="number"
                required
                min={1}
                max={20}
                value={formData.seatingCapacity}
                onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Odometer (km)
              </label>
              <input
                type="number"
                min={0}
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Initial Status */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Pricing, Security Hold & Fleet Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Rental Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                step="50"
                value={formData.dailyPrice}
                onChange={(e) => setFormData({ ...formData, dailyPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Deposit Hold (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                step="100"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Operational Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              >
                <option value="AVAILABLE">Available</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Regulatory & Compliance Expiry Dates */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Compliance & Document Expiry Dates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Insurance Expiry Date
              </label>
              <input
                type="date"
                value={formData.insuranceExpiryDate}
                onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registration Expiry Date
              </label>
              <input
                type="date"
                value={formData.registrationExpiryDate}
                onChange={(e) => setFormData({ ...formData, registrationExpiryDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pollution Certificate Expiry
              </label>
              <input
                type="date"
                value={formData.pollutionExpiryDate}
                onChange={(e) => setFormData({ ...formData, pollutionExpiryDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Photo Upload / Preset Gallery Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Primary Vehicle Photo
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Image URL or Quick Presets
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Presets:</span>
              {sampleImages.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, imageUrl: s.url })}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-semibold text-slate-700 transition shrink-0"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {formData.imageUrl && (
              <div className="mt-4 w-48 aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                <img src={formData.imageUrl} alt="Vehicle preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Vehicle Notes & Special Accessories
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Includes rooftop bicycle rack, Apple CarPlay, tinted windows..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/vehicles"
            className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Vehicle...' : 'Save & Register Vehicle'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
