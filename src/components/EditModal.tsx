'use client';

import { useState } from 'react';
import { Prompt } from '@/types';
import { Icons } from './Icons';

interface EditModalProps {
    prompt: Prompt | null;
    onClose: () => void;
    onSave: (id: string, promptText: string, tags: string[]) => Promise<void>;
}

export function EditModal({ prompt, onClose, onSave }: EditModalProps) {
    const [promptText, setPromptText] = useState(prompt?.promptText || '');
    const [tags, setTags] = useState(prompt?.tags.join(', ') || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!prompt) return null;

    const handleSave = async () => {
        if (!promptText.trim()) {
            alert('Prompt metni gerekli');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(
                prompt.id,
                promptText.trim(),
                tags.split(',').map((t) => t.trim()).filter(Boolean)
            );
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--color-border)',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Promptu Düzenle</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                        }}
                    >
                        <Icons.X />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {/* Prompt Text */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Prompt Metni
                        </label>
                        <textarea
                            className="input-glass"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            rows={8}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Etiketler
                        </label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="midjourney, portrait, cinematic"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isSaving}
                            style={{ flex: 1 }}
                        >
                            İptal
                        </button>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                            disabled={isSaving || !promptText.trim()}
                            style={{ flex: 1 }}
                        >
                            {isSaving ? <><div className="spinner" /> Kaydediliyor...</> : 'Güncelle'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
