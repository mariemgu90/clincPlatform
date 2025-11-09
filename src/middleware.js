import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // Redirect to login if no token is found
  if (!token) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Role-based access control
  const userRole = token.role;
  const adminPaths = ['/admin', '/admin/dashboard', '/admin/clinics'];

  if (adminPaths.some(path => req.nextUrl.pathname.startsWith(path)) && userRole !== 'ADMIN') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*'],
};