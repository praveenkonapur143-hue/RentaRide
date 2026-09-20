'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Plus,
  Search,
  Filter,
  Users,
  Fuel,
  Gauge,
  Calendar,
  MoreVertical,
  Archive,
  Eye,
  Edit,
  Sparkles
} from 'lucide-react';
import { VehicleStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/currency';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this vehicle from active operations?')) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVehicles(prev => prev.filter(v => v.id !== id));
      } else {
        const d = await res.json();
        alert(d.error || 'Archive failed');
      }
    } catch (err: any) {
      alert(err.message || 'Archive failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fleet Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage vehicles, review specifications, update availability, and track compliance.
          </p>
        </div>

        <Link
          href="/dashboard/vehicles/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, model, or registration number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        {/* Category filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Car Types</option>
            <option value="HATCHBACK">Hatchbacks</option>
            <option value="SEDAN">Sedans</option>
            <option value="SUV">SUVs & 4x4</option>
            <option value="MPV">7-Seater / MPVs</option>
            <option value="LUXURY">Luxury Cars</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="RENTED">Active Rental</option>
            <option value="UNDER_MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading fleet inventory...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No vehicles found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Image & Status Badge */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={v.images?.[0]?.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'}
                  alt={`${v.brand} ${v.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3">
                  <VehicleStatusBadge status={v.status} />
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold tracking-wider uppercase">
                  {v.type}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                        {v.brand} {v.model}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Plate: {v.registrationNumber} • {v.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">{formatINR(v.dailyPrice)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">/ day</p>
                    </div>
                  </div>

                  {/* Specs row */}
                  <div className="grid grid-cols-3 gap-2 my-4 py-2.5 border-y border-slate-100 text-center">
                    <div>
                      <Users className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-700">{v.seatingCapacity} Seats</span>
                    </div>
                    <div>
                      <Fuel className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-700 capitalize">{v.fuelType.toLowerCase()}</span>
                    </div>
                    <div>
                      <Gauge className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-700">{v.odometerReading?.toLocaleString() || 0} km</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                  <Link
                    href={`/dashboard/vehicles/${v.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details & History</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleArchive(v.id)}
                      title="Archive Vehicle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
