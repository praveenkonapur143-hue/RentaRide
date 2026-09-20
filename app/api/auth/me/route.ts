import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-auth';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const fullUser = dataStore.getUserById(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: fullUser?.avatar,
      phone: fullUser?.phone,
    }
  });
}
