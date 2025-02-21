import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Force log to console
    console.log('[Middleware Debug]', {
        path: request.nextUrl.pathname,
        cookies: request.cookies.getAll(),
        timestamp: new Date().toISOString()
    });

    if (request.nextUrl.pathname.startsWith('/polls')) {
        const webauthnCookie = request.cookies.get('webauthnrs');

        if (!webauthnCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths starting with /polls
         * Match exact /polls path
         */
        '/polls/:path*',
        '/polls'
    ]
}