import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define role-based access for routes
const roleAccess = {
  '/admin': ['ADMIN'],
  '/admin/*': ['ADMIN'],
  '/dashboard': ['ADMIN', 'DOCTOR', 'RECEPTIONIST'],
  '/patients': ['ADMIN', 'DOCTOR', 'RECEPTIONIST'],
  '/patients/*': ['ADMIN', 'DOCTOR', 'RECEPTIONIST'],
  '/calendar': ['ADMIN', 'DOCTOR', 'RECEPTIONIST'],
  '/consultations': ['ADMIN', 'DOCTOR'],
  '/consultations/*': ['ADMIN', 'DOCTOR'],
  '/prescriptions': ['ADMIN', 'DOCTOR'],
  '/prescriptions/*': ['ADMIN', 'DOCTOR', 'PATIENT'],
  '/billing': ['ADMIN', 'RECEPTIONIST'],
  '/billing/*': ['ADMIN', 'RECEPTIONIST'],
  '/analytics': ['ADMIN'],
  '/settings': ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'],
  '/portal': ['PATIENT'],
  '/portal/*': ['PATIENT'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirect root dashboard based on role
    if (path === '/dashboard') {
      const redirectPath = getRoleBasedRedirect(token.role);
      if (redirectPath !== '/dashboard') {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(roleAccess)) {
      const routePattern = route.replace('/*', '');
      
      if (path.startsWith(routePattern)) {
        if (!allowedRoles.includes(token.role)) {
          // Redirect based on user role
          const redirectPath = getRoleBasedRedirect(token.role);
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

function getRoleBasedRedirect(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'DOCTOR':
      return '/dashboard';
    case 'RECEPTIONIST':
      return '/dashboard';
    case 'PATIENT':
      return '/portal/dashboard';
    default:
      return '/';
  }
}

// Protect all routes except public pages
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/patients/:path*',
    '/calendar/:path*',
    '/consultations/:path*',
    '/prescriptions/:path*',
    '/billing/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/admin/clinics/:path*',
    '/portal/:path*',
  ],
};
