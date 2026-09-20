import { NextRequest, NextResponse } from 'next/server';
import { FleetService } from '@/modules/fleet/service';
import { requireAuth } from '@/lib/api-auth';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const vehicle = FleetService.getVehicleById(params.id);
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }

  // Also include related data for comprehensive detail view
  const bookings = dataStore.getBookings({ vehicleId: params.id });
  const maintenance = dataStore.getMaintenance({ vehicleId: params.id });
  const inspections = dataStore.getInspections({ vehicleId: params.id });
  const damageReports = dataStore.getDamageReports({ vehicleId: params.id });

  return NextResponse.json({
    vehicle,
    bookings,
    maintenance,
    inspections,
    damageReports,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = FleetService.updateVehicle(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Only Admin can archive vehicles
  const auth = requireAuth(req, ['ADMIN']);
  if (!auth.authorized) return auth.response;

  const archived = FleetService.archiveVehicle(params.id);
  if (!archived) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Vehicle archived successfully', vehicle: archived });
}
