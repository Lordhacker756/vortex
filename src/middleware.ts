import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname from the request URL
    const path = request.nextUrl.pathname;
    console.log("Middleware running...")

    // Check if the path starts with /polls
    if (path.startsWith('/polls')) {
        // Get the authToken from cookies
        const authToken = request.cookies.get('authToken');

        // If there's no authToken, redirect to login
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If authToken exists or path doesn't start with /polls, continue with the request
    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: ['/polls/:path*']
};