import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { imageUrls } = await request.json();

        if (!imageUrls || !Array.isArray(imageUrls)) {
            return NextResponse.json({ error: 'imageUrls array gerekli' }, { status: 400 });
        }

        const base64Images: { url: string; base64: string | null; type: string }[] = [];

        for (const url of imageUrls) {
            try {
                // Fetch the image
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://twitter.com/',
                    },
                });

                if (!response.ok) {
                    base64Images.push({ url, base64: null, type: 'error' });
                    continue;
                }

                const contentType = response.headers.get('content-type') || 'image/jpeg';
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const dataUrl = `data:${contentType};base64,${base64}`;

                base64Images.push({ url, base64: dataUrl, type: contentType });
            } catch (e) {
                console.error('Failed to fetch image:', url, e);
                base64Images.push({ url, base64: null, type: 'error' });
            }
        }

        return NextResponse.json({ images: base64Images });
    } catch (error) {
        console.error('Image fetch error:', error);
        return NextResponse.json({ error: 'Görsel indirilemedi' }, { status: 500 });
    }
}
