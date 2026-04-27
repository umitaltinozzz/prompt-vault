import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

// Ensure upload directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Generate unique filename
function generateFilename(originalUrl: string, type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = type.startsWith('video') ? 'mp4' : 'jpg';
    return `${timestamp}_${random}.${ext}`;
}

// Download and save media from URL
async function downloadMedia(url: string): Promise<{
    buffer: Buffer;
    contentType: string
} | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://twitter.com/',
            },
        });

        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return { buffer, contentType };
    } catch (e) {
        console.error('Download failed:', url, e);
        return null;
    }
}

import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json(
                { success: false, error: 'urls array gerekli' },
                { status: 400 }
            );
        }

        await ensureUploadDir();

        const results: {
            originalUrl: string;
            localPath: string | null;
            publicUrl: string | null;
        }[] = [];

        for (const url of urls) {
            const download = await downloadMedia(url);

            if (!download) {
                results.push({ originalUrl: url, localPath: null, publicUrl: null });
                continue;
            }

            const filename = generateFilename(url, download.contentType);
            const filePath = join(UPLOAD_DIR, filename);

            await writeFile(filePath, download.buffer);

            // Public URL (assuming UPLOAD_DIR is in public folder)
            const publicUrl = `/uploads/${filename}`;

            results.push({
                originalUrl: url,
                localPath: filePath,
                publicUrl,
            });
        }

        return NextResponse.json({ success: true, data: results });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: 'Yükleme hatası' },
            { status: 500 }
        );
    }
}
