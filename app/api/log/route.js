import { logError } from '@/services/logger';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { error, stack, context } = body;
        
        // Log the client-side error to our server-side file
        logError({ message: error, stack }, context || 'CLIENT_SIDE');
        
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
    }
}
