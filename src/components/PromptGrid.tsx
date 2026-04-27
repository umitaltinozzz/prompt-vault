'use client';

import { Prompt } from '@/types';
import { PromptCard } from './PromptCard';
import { Icons } from './Icons';

interface PromptGridProps {
    prompts: Prompt[];
    isLoading: boolean;
    searchQuery: string;
    onView: (prompt: Prompt) => void;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onCopy: (text: string) => void;
}

export function PromptGrid({
    prompts,
    isLoading,
    searchQuery,
    onView,
    onEdit,
    onDelete,
    onCopy,
}: PromptGridProps) {
    // Filter prompts by search query
    const filteredPrompts = prompts.filter((prompt) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            prompt.promptText.toLowerCase().includes(query) ||
            prompt.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            prompt.authorHandle?.toLowerCase().includes(query)
        );
    });

    // Loading state
    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                }}
            >
                <div className="spinner" style={{ width: '40px', height: '40px' }} />
            </div>
        );
    }

    // Empty state
    if (prompts.length === 0) {
        return (
            <div className="empty-state">
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                    }}
                >
                    <div style={{ width: '40px', height: '40px', color: 'var(--color-accent)' }}>
                        <Icons.Empty />
                    </div>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                    Henüz prompt yok
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
                    İlham veren AI promptlarını kaydetmeye başlayın. Twitter&apos;dan tek tıkla çekin!
                </p>
            </div>
        );
    }

    // No search results
    if (filteredPrompts.length === 0) {
        return (
            <div className="empty-state">
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                    Sonuç bulunamadı
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    &quot;{searchQuery}&quot; için eşleşen prompt yok.
                </p>
            </div>
        );
    }

    return (
        <div className="prompt-grid">
            {filteredPrompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopy={onCopy}
                />
            ))}
        </div>
    );
}
