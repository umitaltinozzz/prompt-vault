import { NextRequest, NextResponse } from 'next/server';

// Cobalt API v10 - yeni endpoint
// Docs: https://github.com/imputnet/cobalt
const COBALT_API = 'https://api.cobalt.tools';

import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tweetUrl } = await request.json();

        if (!tweetUrl) {
            return NextResponse.json({ error: 'Tweet URL gerekli' }, { status: 400 });
        }

        // Cobalt API v10
        const cobaltResponse = await fetch(COBALT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                url: tweetUrl,
                videoQuality: '720',
                filenameStyle: 'basic',
                downloadMode: 'auto',
                twitterGif: true,
            }),
        });

        const cobaltData = await cobaltResponse.json();

        // Log for debugging
        console.log('Cobalt response:', JSON.stringify(cobaltData, null, 2));

        if (!cobaltResponse.ok || cobaltData.status === 'error') {
            console.error('Cobalt API error:', cobaltData);
            return NextResponse.json(
                { error: cobaltData.text || 'Video indirilemedi' },
                { status: 500 }
            );
        }

        // Handle different response types
        let videoUrl = '';
        const mediaItems: { type: string; url: string; thumb?: string }[] = [];

        // v10 response format
        if (cobaltData.url) {
            videoUrl = cobaltData.url;
        } else if (cobaltData.picker && Array.isArray(cobaltData.picker)) {
            for (const item of cobaltData.picker) {
                mediaItems.push({
                    type: item.type || 'video',
                    url: item.url,
                    thumb: item.thumb,
                });
                if (!videoUrl && item.type === 'video') {
                    videoUrl = item.url;
                }
            }
        }

        return NextResponse.json({
            status: cobaltData.status,
            videoUrl,
            mediaItems,
            filename: cobaltData.filename,
        });

    } catch (error) {
        console.error('Video download error:', error);
        return NextResponse.json(
            { error: 'Video indirme hatası' },
            { status: 500 }
        );
    }
}
