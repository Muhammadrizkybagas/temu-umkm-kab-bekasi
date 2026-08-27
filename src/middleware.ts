import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route yang membutuhkan proteksi
const protectedRoutes = ['/admin', '/api/admin'];

// Route publik/auth yang TIDAK boleh dikunci oleh middleware
const publicAuthRoutes = ['/login', '/admin/login', '/api/admin/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Jika mencoba mengakses route login publik (misal /login atau /api/admin/login)
  const isPublicAuthRoute = publicAuthRoutes.some((route) => pathname === route);

  if (isPublicAuthRoute) {
    // Jika user SUDAH login tapi mencoba buka halaman /login atau /admin/login, lempar ke dashboard
    if (token && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Biarkan akses masuk ke API login / halaman login
    return NextResponse.next();
  }

  // 2. Cek apakah route yang diakses termasuk protected route
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 3. Jika route diproteksi dan TIDAK ADA token
  if (isProtected && !token) {
    // Jika yang diakses adalah Endpoint API Admin, kembalikan JSON 401
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Jika halaman biasa, redirect ke halaman login (sesuaikan path login kamu)
    const loginUrl = new URL('/login', request.url); // ganti '/admin/login' jika halaman login kamu di sana
    loginUrl.searchParams.set('from', pathname); // opsional: simpan lokasi asal
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config matcher
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};