import { removeBackground } from '@/services/bg-removal';
import { logError } from '@/services/logger';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Max allowed by Vercel free tier, to prevent timeout during model download.

export async function POST(req) {
    try {
        const formData = await req.formData();
        const images = formData.getAll('images');

        if (!images || images.length === 0) {
            return NextResponse.json({ error: 'No images uploaded.' }, { status: 400 });
        }

        console.log(`Processing ${images.length} image(s)`);

        const responseData = await Promise.all(
            images.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                const processedBuffer = await removeBackground(buffer);
                
                return {
                    originalName: file.name,
                    originalSize: file.size,
                    base64: processedBuffer.toString('base64'),
                    mimeType: 'image/png'
                };
            })
        );
        
        return NextResponse.json(responseData);
    } catch (error) {
        // Log deep error details to errors.txt for production debugging
        logError(error, 'API_REMOVE_BG');
        
        console.error('Error in /api/remove-bg:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to process image(s).', 
            stack: error.stack,
            name: error.name
        }, { status: 500 });
    }
}
