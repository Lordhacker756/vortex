import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith('/polls')) {
        const authToken = request.cookies.get('authToken');

        // Add more detailed logging
        console.log("Middleware running for path:", path);
        console.log("Auth cookie present:", !!authToken);
        console.log("Cookie value:", authToken?.value);

        if (!authToken?.value) {
            console.log("No valid auth token, redirecting to login");
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/polls/:path*']
};