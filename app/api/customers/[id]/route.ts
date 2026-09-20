import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  const customer = dataStore.getCustomerById(params.id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const bookings = dataStore.getBookings({ customerId: params.id });
  const payments = dataStore.getPayments({ customerId: params.id });
  const damageReports = dataStore.getDamageReports({ customerId: params.id });
  const invoices = dataStore.getInvoices({ customerId: params.id });

  const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  return NextResponse.json({
    customer,
    bookings,
    payments,
    damageReports,
    invoices,
    outstandingBalance,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = dataStore.updateCustomer(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
