import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
  '/profiw',
  '/jobs/create',
  '/candidates',
  '/applicants',
];

// Define routes that should be inaccessible when logged in
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the route is protected and user is not authenticated
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes while already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 