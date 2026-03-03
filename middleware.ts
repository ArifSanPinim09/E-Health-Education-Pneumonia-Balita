import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifyToken } from '@/lib/auth/jwt'

// Routes that require user authentication
const userProtectedRoutes = [
  '/dashboard',
  '/pre-test',
  '/post-test',
  '/session',
  '/results',
  '/profile-setup',
]

// Routes that require admin authentication
const adminProtectedRoutes = ['/admin']

// Public routes that don't require authentication
const publicRoutes = ['/login', '/admin-login', '/auth/callback']

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Create response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Update Supabase session in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if exists
  await supabase.auth.getSession()

  // If root path has OAuth code, redirect to callback
  if (pathname === '/' && searchParams.has('code')) {
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.searchParams.set('code', searchParams.get('code')!)
    return NextResponse.redirect(callbackUrl)
  }

  // Allow exact root path
  if (pathname === '/') {
    return response
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return response
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api')) {
    return response
  }

  // Check admin routes
  if (adminProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const adminToken = request.cookies.get('admin-token')?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }

    const verification = await verifyToken(adminToken)
    if (!verification.valid || verification.payload?.type !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }

    return response
  }

  // Check user routes
  if (userProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const verification = await verifyToken(authToken)
    
    if (!verification.valid) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    if (verification.payload?.type !== 'user') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
