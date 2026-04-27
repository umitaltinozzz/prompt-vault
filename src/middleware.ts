import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isLoginPage = req.nextUrl.pathname === '/login';
    const isRegisterPage = req.nextUrl.pathname === '/register';
    const isAuthPage = isLoginPage || isRegisterPage;
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');
    const isPublicAsset = req.nextUrl.pathname.startsWith('/uploads') ||
        req.nextUrl.pathname.startsWith('/_next');

    // Allow public assets and API routes
    if (isPublicAsset) {
        return NextResponse.next();
    }

    // Protect API routes (except auth)
    if (isApiRoute && !req.nextUrl.pathname.startsWith('/api/auth')) {
        if (!isLoggedIn) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.next();
    }

    // Redirect to login if not logged in and not on auth page
    if (!isLoggedIn && !isAuthPage && !isApiRoute) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Redirect to home if logged in and on auth page
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
