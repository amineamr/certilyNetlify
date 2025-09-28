// /middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/dashboard/super-admin': ['super_user'],
  '/audit': ['airport_manager', 'super_user'],
  '/dashboard/': ['shop_owner', 'airport_manager', 'super_user'],
  '/dashboard/assessments': ['shop_owner', 'airport_manager', 'super_user'],
  '/dashboard/shops': ['airport_manager', 'super_user'],
  '/dashboard/analytics': ['airport_manager', 'super_user'],
}

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
    pathname.startsWith(route)
  )

  // 🔹 1. Redirect unauthenticated users from protected routes
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // 🔹 2. Prevent logged-in users from seeing login/signup
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // 🔹 3. Role-based access
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
      pathname.startsWith(route)
    )?.[1]

    if (requiredRoles && !requiredRoles.includes(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    // Add role + userId headers so server components can use them
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', profile.role)
    requestHeaders.set('x-user-id', user.id)

    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return response
}

export const config = {
  matcher: [
    // Apply to everything except static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
