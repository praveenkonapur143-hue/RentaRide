import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuth } from '@/lib/api-auth';
import { validateCustomerInput } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF', 'CUSTOMER']);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const includeArchived = searchParams.get('includeArchived') === 'true';

  const customers = dataStore.getCustomers({ search, status, includeArchived });
  return NextResponse.json({ customers, count: customers.length });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validation = validateCustomerInput(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const customer = dataStore.createCustomer(validation.data);
    dataStore.createAuditLog('CREATE_CUSTOMER', 'CUSTOMER', customer.id, { name: customer.fullName }, auth.user?.id);

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Customer creation failed' }, { status: 500 });
  }
}
