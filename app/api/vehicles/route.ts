import { NextRequest, NextResponse } from 'next/server';
import { FleetService } from '@/modules/fleet/service';
import { requireAuth } from '@/lib/api-auth';
import { validateVehicleInput } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const fuelType = searchParams.get('fuelType') || undefined;
  const transmission = searchParams.get('transmission') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const seats = searchParams.get('seats') ? parseInt(searchParams.get('seats')!) : undefined;
  const includeArchived = searchParams.get('includeArchived') === 'true';

  const vehicles = FleetService.getAllVehicles({
    type,
    status,
    search,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    seats,
    includeArchived,
  });

  return NextResponse.json({ vehicles, count: vehicles.length });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validation = validateVehicleInput(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const vehicle = FleetService.createVehicle(validation.data);
    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create vehicle' }, { status: 500 });
  }
}
