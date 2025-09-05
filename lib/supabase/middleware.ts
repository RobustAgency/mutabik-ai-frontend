import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createSupabaseMiddlewareClient(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    return { supabase, response }
}


export async function updateSession(request: NextRequest) {
    const { supabase, response } = createSupabaseMiddlewareClient(request)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()
    const pathname = url.pathname

    const authRoutes = [
        '/login',
        '/admin/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/update-password',
        '/auth/confirm',
    ]

    const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    const isLogoutRoute = pathname === '/logout'

    const redirectWithCookies = (toPath: string) => {
        const target = request.nextUrl.clone()
        target.pathname = toPath
        const redirectResponse = NextResponse.redirect(target)
        response.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie)
        })
        return redirectResponse
    }

    if (!user) {
        if (!isAuthRoute) {
            return redirectWithCookies('/login')
        }
        return response
    }

    if (user && isAuthRoute && !isLogoutRoute) {
        if (user.user_metadata.role === 'admin') {
            return redirectWithCookies('/admin/dashboard')
        } else {
            return redirectWithCookies('/dashboard')
        }
    }

    if (user && pathname === '/') {
        if (user.user_metadata.role === 'admin') {
            return redirectWithCookies('/admin/dashboard')
        } else {
            return redirectWithCookies('/dashboard')
        }
    }

    return response
}