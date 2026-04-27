'use client';

import { signOut } from 'next-auth/react';
import { Icons } from './Icons';

interface HeaderProps {
    promptCount: number;
    onAddClick: () => void;
}

export function Header({ promptCount, onAddClick }: HeaderProps) {
    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '20px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    <Icons.Vault />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                        Prompt Vault
                    </h1>
                    <p
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '14px',
                            margin: 0,
                        }}
                    >
                        {promptCount} prompt kayıtlı
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    className="btn-secondary"
                    onClick={() => signOut()}
                    title="Çıkış Yap"
                >
                    <Icons.Trash /> Çıkış
                </button>
                <button className="btn-primary" onClick={onAddClick}>
                    <Icons.Plus />
                    Yeni Prompt
                </button>
            </div>
        </header>
    );
}
