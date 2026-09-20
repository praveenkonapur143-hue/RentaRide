import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const result = await AuthService.register(name, email, password, role || 'STAFF');
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const res = NextResponse.json({ success: true, user: result.user });
    res.cookies.set('rentaride_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
