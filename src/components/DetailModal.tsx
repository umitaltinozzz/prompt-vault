'use client';

import { Prompt } from '@/types';
import { Icons } from './Icons';
import { formatDate, copyToClipboard } from '@/lib/utils';

interface DetailModalProps {
    prompt: Prompt | null;
    onClose: () => void;
    onEdit: (prompt: Prompt) => void;
    onCopy: () => void;
}

export function DetailModal({ prompt, onClose, onEdit, onCopy }: DetailModalProps) {
    if (!prompt) return null;

    const hasVideo = prompt.media?.some((m) => m.type === 'video');

    const handleCopy = async () => {
        await copyToClipboard(prompt.promptText);
        onCopy();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content" style={{ maxWidth: '800px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {prompt.authorHandle && (
                            <>
                                <Icons.Twitter />
                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                    @{prompt.authorHandle}
                                </span>
                            </>
                        )}
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {formatDate(prompt.createdAt)}
                        </span>
                    </div>
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
                    {/* Media Gallery */}
                    {prompt.media && prompt.media.length > 0 && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: prompt.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                gap: '8px',
                                marginBottom: '20px',
                            }}
                        >
                            {prompt.media.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: 'var(--color-bg-primary)',
                                        position: 'relative',
                                        aspectRatio: prompt.media!.length > 1 ? '1' : '16/9',
                                    }}
                                >
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.localPath || item.url}
                                            alt={`Görsel ${idx + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => window.open(item.localPath || item.url, '_blank')}
                                        />
                                    ) : (
                                        /* Video - play if local, otherwise link to tweet */
                                        item.url?.startsWith('/uploads/') ? (
                                            // Local video - play directly
                                            <video
                                                src={item.url}
                                                controls
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                poster={item.thumbnailPath || undefined}
                                            />
                                        ) : (
                                            // Remote video - show thumbnail with link
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => prompt.tweetUrl && window.open(prompt.tweetUrl, '_blank')}
                                            >
                                                {item.thumbnailPath && (
                                                    <img
                                                        src={item.thumbnailPath}
                                                        alt="Video thumbnail"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'rgba(0,0,0,0.3)',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '50%',
                                                            background: 'rgba(139, 92, 246, 0.95)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Icons.Play />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        left: '8px',
                                                        background: 'rgba(139, 92, 246, 0.9)',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    🎬 Tweet&apos;te izle
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Prompt Text */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <p
                            style={{
                                fontSize: '15px',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap',
                                color: 'var(--color-text-primary)',
                                margin: 0,
                            }}
                        >
                            {prompt.promptText}
                        </p>
                    </div>

                    {/* Tags */}
                    {prompt.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {prompt.tags.map((tag, idx) => (
                                <span key={idx} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            onClick={handleCopy}
                            style={{ flex: 1, minWidth: '120px' }}
                        >
                            <Icons.Copy /> Promptu Kopyala
                        </button>
                        {prompt.tweetUrl && (
                            <a
                                href={prompt.tweetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{
                                    flex: 1,
                                    minWidth: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    textDecoration: 'none',
                                }}
                            >
                                <Icons.Link /> Tweet&apos;e Git
                            </a>
                        )}
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                onClose();
                                onEdit(prompt);
                            }}
                            style={{ flex: 1, minWidth: '120px' }}
                        >
                            <Icons.Edit /> Düzenle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
