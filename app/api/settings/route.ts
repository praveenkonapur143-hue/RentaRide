import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const settings = dataStore.getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  // Only Admin can modify settings
  const auth = requireAuth(req, ['ADMIN']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = dataStore.updateSettings(body);
    dataStore.createAuditLog('UPDATE_SETTINGS', 'SETTINGS', updated.id, body, auth.user?.id);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 });
  }
}
