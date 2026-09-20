import { NextRequest, NextResponse } from 'next/server';
import { MaintenanceService } from '@/modules/maintenance/service';
import { requireAuth } from '@/lib/api-auth';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get('vehicleId') || undefined;
  const status = searchParams.get('status') || undefined;

  const records = MaintenanceService.getAllMaintenance({ vehicleId, status });
  const alerts = MaintenanceService.getExpiryRadar();

  const enriched = records.map(r => {
    const v = dataStore.getVehicleById(r.vehicleId);
    return {
      ...r,
      brand: v?.brand || '',
      model: v?.model || '',
      registrationNumber: v?.registrationNumber || '',
    };
  });

  return NextResponse.json({ records: enriched, alerts });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    if (!body.vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }
    const record = MaintenanceService.createMaintenance(body);
    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Maintenance record creation failed' }, { status: 500 });
  }
}
