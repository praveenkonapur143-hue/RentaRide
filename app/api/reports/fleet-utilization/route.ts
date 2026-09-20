import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  const vehicles = dataStore.getVehicles({ includeArchived: false });
  const bookings = dataStore.getBookings();

  // 1. Vehicle utilization & booking counts
  const vehicleStats = vehicles.map(v => {
    const vBookings = bookings.filter(b => b.vehicleId === v.id && b.status !== 'CANCELLED');
    const totalDaysRented = vBookings.reduce((sum, b) => sum + b.days, 0);
    const totalRevenue = vBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    // Utilization over 30-day window
    const utilizationRate = Math.min(100, Math.round((totalDaysRented / 30) * 100));

    return {
      vehicleId: v.id,
      brand: v.brand,
      model: v.model,
      registrationNumber: v.registrationNumber,
      type: v.type,
      bookingsCount: vBookings.length,
      totalDaysRented,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      utilizationRate,
    };
  });

  vehicleStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  // 2. Booking status distribution
  const statusCounts: Record<string, number> = {};
  bookings.forEach(b => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return NextResponse.json({
    vehicleStats,
    statusDistribution,
    mostRentedVehicles: vehicleStats.slice(0, 5),
  });
}
