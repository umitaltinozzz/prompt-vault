import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email ve şifre gerekli' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Şifre en az 8 karakter olmalı' },
                { status: 400 }
            );
        }

        // Check if any user exists - only first user can register
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            return NextResponse.json(
                { error: 'Kayıt kapalı. Sadece bir kullanıcı destekleniyor.' },
                { status: 403 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu email zaten kayıtlı' },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || 'Admin',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Admin hesabı oluşturuldu',
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Kayıt hatası' },
            { status: 500 }
        );
    }
}

// Check if registration is open (no users exist)
export async function GET() {
    try {
        const userCount = await prisma.user.count();
        return NextResponse.json({
            registrationOpen: userCount === 0,
        });
    } catch {
        return NextResponse.json({ registrationOpen: false });
    }
}
