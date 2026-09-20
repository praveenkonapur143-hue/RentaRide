'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, Upload, Save, Check, Sparkles, FileImage, Image as ImageIcon, X } from 'lucide-react';

export default function NewVehiclePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    { label: 'BMW M4 Competition', url: '/images/cars/bmw-m4.jpg', brand: 'BMW', model: 'M4 Competition Coupé', type: 'LUXURY', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 18500, securityDeposit: 35000 },
    { label: 'BMW M4 (/BMW4.jpg)', url: '/images/cars/BMW4.jpg', brand: 'BMW', model: 'M4 Competition M xDrive', type: 'LUXURY', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 18500, securityDeposit: 35000 },
    { label: 'Mahindra Thar 4x4', url: '/images/cars/thar.jpg', brand: 'Mahindra', model: 'Thar LX Hard Top 4x4', type: 'SUV', fuelType: 'DIESEL', transmission: 'MANUAL', dailyPrice: 4500, securityDeposit: 5000 },
    { label: 'Toyota Fortuner Legender', url: '/images/cars/fortuner.jpg', brand: 'Toyota', model: 'Fortuner Legender 4x4', type: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC', dailyPrice: 8500, securityDeposit: 15000 },
    { label: 'Maruti Suzuki Swift', url: '/images/cars/swift.jpg', brand: 'Maruti Suzuki', model: 'Swift ZXi+', type: 'HATCHBACK', fuelType: 'PETROL', transmission: 'MANUAL', dailyPrice: 1800, securityDeposit: 2000 },
    { label: 'Maruti Suzuki Baleno', url: '/images/cars/baleno.jpg', brand: 'Maruti Suzuki', model: 'Baleno Alpha', type: 'HATCHBACK', fuelType: 'PETROL', transmission: 'MANUAL', dailyPrice: 2100, securityDeposit: 2500 },
    { label: 'Toyota Innova Crysta', url: '/images/cars/innova.jpg', brand: 'Toyota', model: 'Innova Crysta 2.4 VX', type: 'MPV', fuelType: 'DIESEL', transmission: 'MANUAL', dailyPrice: 4200, securityDeposit: 5000 },
    { label: 'Tata Nexon', url: '/images/cars/nexon.jpg', brand: 'Tata', model: 'Nexon Fearless+ S', type: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 2600, securityDeposit: 3000 },
    { label: 'Mahindra Scorpio-N', url: '/images/cars/scorpio.jpg', brand: 'Mahindra', model: 'Scorpio-N Z8L 4x4', type: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC', dailyPrice: 4800, securityDeposit: 6000 },
    { label: 'Honda City', url: '/images/cars/city.jpg', brand: 'Honda', model: 'City ZX i-VTEC', type: 'SEDAN', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 3200, securityDeposit: 4000 },
    { label: 'Hyundai Creta', url: '/images/cars/creta.png', brand: 'Hyundai', model: 'Creta SX (O)', type: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC', dailyPrice: 3400, securityDeposit: 4000 },
    { label: 'Kia Seltos', url: '/images/cars/seltos.jpg', brand: 'Kia', model: 'Seltos GTX+ Turbo', type: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 3500, securityDeposit: 4000 },
    { label: 'Volkswagen Virtus GT', url: '/images/cars/virtus.png', brand: 'Volkswagen', model: 'Virtus GT Plus DSG', type: 'SEDAN', fuelType: 'PETROL', transmission: 'AUTOMATIC', dailyPrice: 3300, securityDeposit: 4000 },
    { label: 'Tata Tiago EV', url: '/images/cars/tiago.jpg', brand: 'Tata', model: 'Tiago EV Tech Lux', type: 'HATCHBACK', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC', dailyPrice: 1900, securityDeposit: 2500 },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
        setImageLoadError(false);
      }
      setUploadingImage(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: typeof sampleImages[0]) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: preset.url,
      brand: prev.brand || preset.brand,
      model: prev.model || preset.model,
      type: preset.type || prev.type,
      fuelType: preset.fuelType || prev.fuelType,
      transmission: preset.transmission || prev.transmission,
      dailyPrice: prev.dailyPrice === 2499 ? preset.dailyPrice : prev.dailyPrice,
      securityDeposit: prev.securityDeposit === 3000 ? preset.securityDeposit : prev.securityDeposit,
    }));
    setImageLoadError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl ? formData.imageUrl.trim() : '';
      if (!finalImageUrl) {
        finalImageUrl = '/images/cars/swift.jpg';
      } else if (
        !finalImageUrl.startsWith('http://') &&
        !finalImageUrl.startsWith('https://') &&
        !finalImageUrl.startsWith('/') &&
        !finalImageUrl.startsWith('data:')
      ) {
        // Automatically ensure leading slash for relative paths like "images/cars/BMW4.jpg"
        finalImageUrl = '/' + finalImageUrl;
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        year: parseInt(String(formData.year)),
        seatingCapacity: parseInt(String(formData.seatingCapacity)),
        dailyPrice: parseFloat(String(formData.dailyPrice)),
        securityDeposit: parseFloat(String(formData.securityDeposit)),
        odometerReading: parseInt(String(formData.odometerReading)),
        images: [
          {
            id: `img-${Date.now()}`,
            url: finalImageUrl,
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Primary Vehicle Photo
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports custom local paths (e.g. <code>/images/cars/bmw-m4.jpg</code>, <code>/images/cars/BMW4.jpg</code>), external web URLs, or direct device uploads.
              </p>
            </div>

            {/* Direct Upload Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Loading Image...' : 'Upload Image from Computer'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Image URL or Local Relative Path
            </label>
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImageLoadError(false);
              }}
              placeholder="/images/cars/bmw-m4.jpg, /images/cars/BMW4.jpg, or https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            />

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">Quick Car Presets (Click to Auto-fill):</span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
                {sampleImages.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => applyPreset(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shrink-0 ${
                      formData.imageUrl === s.url
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {s.label.includes('BMW') && <Sparkles className="w-3 h-3 text-amber-400" />}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            {formData.imageUrl && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-48 aspect-[16/10] rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-sm shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Vehicle preview"
                    onError={() => setImageLoadError(true)}
                    onLoad={() => setImageLoadError(false)}
                    className="w-full h-full object-cover"
                  />
                  {imageLoadError && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-2 text-white">
                      <FileImage className="w-6 h-6 text-amber-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300">Custom Path Staged</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 truncate">
                      {formData.brand || 'Custom'} {formData.model || 'Car'}
                    </span>
                    {!imageLoadError ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Image Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Path Staged
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {formData.imageUrl.startsWith('data:') ? 'Uploaded custom photo (Base64 data)' : formData.imageUrl}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {!imageLoadError
                      ? 'Image loaded successfully and will be displayed across fleet catalogs and booking passes.'
                      : 'Custom URL staged. The link will be registered with the car and resolved on public routes.'}
                  </p>
                </div>
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
