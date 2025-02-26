import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the webauthn cookie
    (await cookies()).delete('webauthnrs');

    // You might also want to notify your Rust backend about the logout
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Failed to notify backend about logout:', error);
    }

    return NextResponse.json({
        message: 'Logged out successfully',
        status: 'success'
    });
}