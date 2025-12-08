// proxy.ts (or src/proxy.ts if using src directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication status from cookie
  const authCookie = request.cookies.get('auth-token');
  const isAuthenticated = authCookie?.value === 'authenticated';
  
  // Handle root path redirect
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/governance', request.url));
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // If user is authenticated and trying to access auth pages, redirect to governance
  if (isAuthenticated && publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/governance', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};