import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { AuthenticatedUser } from '@/modules/auth/types';

export function getAuthUser(req: NextRequest): AuthenticatedUser | null {
  const cookie = req.cookies.get('rentaride_token')?.value;
  const authHeader = req.headers.get('authorization');
  const token = cookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) return null;
  return verifyToken(token);
}

export type RequireAuthResult =
  | { authorized: false; response: NextResponse; user: null }
  | { authorized: false; response: NextResponse; user: AuthenticatedUser }
  | { authorized: true; response: null; user: AuthenticatedUser };

export function requireAuth(
  req: NextRequest,
  allowedRoles?: ('ADMIN' | 'STAFF' | 'CUSTOMER')[]
): RequireAuthResult {
  const user = getAuthUser(req);
  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 }),
      user: null,
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 }),
      user,
    };
  }

  return { authorized: true, response: null, user };
}
