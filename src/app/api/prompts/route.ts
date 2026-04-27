import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreatePromptInput } from '@/types';
import { auth } from '@/auth';

// GET /api/prompts - List all prompts
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const prompts = await prisma.prompt.findMany({
            include: { media: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, data: prompts });
    } catch (error) {
        console.error('Failed to fetch prompts:', error);
        return NextResponse.json(
            { success: false, error: 'Promptlar yüklenemedi' },
            { status: 500 }
        );
    }
}

// POST /api/prompts - Create new prompt
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: CreatePromptInput = await request.json();

        if (!body.promptText?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Prompt metni gerekli' },
                { status: 400 }
            );
        }

        // Check for duplicate tweetId
        if (body.tweetId) {
            const existing = await prisma.prompt.findUnique({
                where: { tweetId: body.tweetId },
            });
            if (existing) {
                return NextResponse.json(
                    { success: false, error: 'Bu tweet zaten kaydedilmiş' },
                    { status: 409 }
                );
            }
        }

        // Create prompt with media
        const prompt = await prisma.prompt.create({
            data: {
                tweetUrl: body.tweetUrl,
                tweetId: body.tweetId,
                promptText: body.promptText.trim(),
                tags: body.tags || [],
                author: body.author,
                authorHandle: body.authorHandle,
                media: body.mediaItems
                    ? {
                        create: body.mediaItems.map((item) => ({
                            type: item.type,
                            url: item.url,
                            thumbnailPath: item.thumbnailUrl,
                        })),
                    }
                    : undefined,
            },
            include: { media: true },
        });

        return NextResponse.json({ success: true, data: prompt }, { status: 201 });
    } catch (error) {
        console.error('Failed to create prompt:', error);
        return NextResponse.json(
            { success: false, error: 'Prompt oluşturulamadı' },
            { status: 500 }
        );
    }
}
