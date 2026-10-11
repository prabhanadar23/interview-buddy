// src/proxy.ts - Handles authentication and route protection
// Note: In Next.js 16+, middleware.ts is renamed to proxy.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  // Create a response object to maintain request headers
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Initialize Supabase client with SSR cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Retrieve all cookies from request
        getAll() {
          return request.cookies.getAll()
        },
        // Set all cookies to both request and response
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Check for authenticated user session
  const { data: { user } } = await supabase.auth.getUser()

  // Define protected routes that require authentication
  const protectedPaths = ['/interview', '/report']
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Rule 1: Redirect unauthenticated users to login page
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Rule 2: Prevent logged-in users from accessing login/signup pages
  if (user && (request.nextUrl.pathname === '/login' || 
               request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// Config: Run proxy only on specific routes to avoid CSS break issues
export const config = {
  matcher: ['/interview/:path*', '/report/:path*', '/login', '/signup'],
}