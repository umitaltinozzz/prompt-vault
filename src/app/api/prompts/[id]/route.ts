import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { UpdatePromptInput } from '@/types';
import { auth } from '@/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/prompts/[id] - Get single prompt
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const prompt = await prisma.prompt.findUnique({
            where: { id },
            include: { media: true },
        });

        if (!prompt) {
            return NextResponse.json(
                { success: false, error: 'Prompt bulunamadı' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: prompt });
    } catch (error) {
        console.error('Failed to fetch prompt:', error);
        return NextResponse.json(
            { success: false, error: 'Prompt yüklenemedi' },
            { status: 500 }
        );
    }
}

// PATCH /api/prompts/[id] - Update prompt
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body: UpdatePromptInput = await request.json();

        const prompt = await prisma.prompt.update({
            where: { id },
            data: {
                promptText: body.promptText?.trim(),
                tags: body.tags,
            },
            include: { media: true },
        });

        return NextResponse.json({ success: true, data: prompt });
    } catch (error) {
        console.error('Failed to update prompt:', error);
        return NextResponse.json(
            { success: false, error: 'Prompt güncellenemedi' },
            { status: 500 }
        );
    }
}

// DELETE /api/prompts/[id] - Delete prompt
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;

        // This will also delete related media (onDelete: Cascade)
        await prisma.prompt.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete prompt:', error);
        return NextResponse.json(
            { success: false, error: 'Prompt silinemedi' },
            { status: 500 }
        );
    }
}
