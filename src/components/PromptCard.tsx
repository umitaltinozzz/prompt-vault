'use client';

import { Prompt } from '@/types';
import { Icons } from './Icons';
import { formatDate } from '@/lib/utils';

interface PromptCardProps {
    prompt: Prompt;
    onView: (prompt: Prompt) => void;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onCopy: (text: string) => void;
}

export function PromptCard({
    prompt,
    onView,
    onEdit,
    onDelete,
    onCopy,
}: PromptCardProps) {
    // Prefer image media for card display, fallback to video thumbnail
    const imageMedia = prompt.media?.find((m) => m.type === 'image');
    const videoMedia = prompt.media?.find((m) => m.type === 'video' || m.type === 'gif');
    const primaryMedia = imageMedia || videoMedia;

    // For display: use image url, or video thumbnail
    const displayUrl = imageMedia
        ? (imageMedia.localPath || imageMedia.url)
        : (videoMedia?.thumbnailPath || videoMedia?.url);

    const hasVideo = prompt.media?.some((m) => m.type === 'video');
    const mediaCount = prompt.media?.length || 0;

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <article
            className="glass-card fade-in"
            style={{ overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => onView(prompt)}
        >
            {/* Media Section */}
            {primaryMedia && displayUrl && (
                <div className="image-container" style={{ position: 'relative' }}>
                    <img
                        src={displayUrl}
                        alt="Prompt görseli"
                        loading="lazy"
                    />

                    {/* Video badge */}
                    {hasVideo && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(139, 92, 246, 0.95)',
                                color: 'white',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            🎬 Video
                        </div>
                    )}

                    {/* Multiple media badge */}
                    {mediaCount > 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            📷 {mediaCount}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px' }}>
                {/* Author info */}
                {prompt.authorHandle && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            color: 'var(--color-text-secondary)',
                            fontSize: '13px',
                        }}
                    >
                        <Icons.Twitter />
                        <span>@{prompt.authorHandle}</span>
                    </div>
                )}

                {/* Prompt text */}
                <p
                    style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                        color: 'var(--color-text-primary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {prompt.promptText}
                </p>

                {/* Tags */}
                {prompt.tags.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginBottom: '16px',
                        }}
                    >
                        {prompt.tags.slice(0, 4).map((tag, idx) => (
                            <span key={idx} className="tag">
                                #{tag}
                            </span>
                        ))}
                        {prompt.tags.length > 4 && (
                            <span className="tag">+{prompt.tags.length - 4}</span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--color-border)',
                    }}
                >
                    <span
                        style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
                    >
                        {formatDate(prompt.createdAt)}
                    </span>

                    <div
                        style={{ display: 'flex', gap: '8px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn-secondary"
                            style={{ padding: '8px' }}
                            onClick={(e) => handleActionClick(e, () => onCopy(prompt.promptText))}
                            title="Kopyala"
                        >
                            <Icons.Copy />
                        </button>
                        {prompt.tweetUrl && (
                            <a
                                href={prompt.tweetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ padding: '8px', display: 'flex' }}
                                title="Tweet'e git"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Icons.Link />
                            </a>
                        )}
                        <button
                            className="btn-secondary"
                            style={{ padding: '8px' }}
                            onClick={(e) => handleActionClick(e, () => onEdit(prompt))}
                            title="Düzenle"
                        >
                            <Icons.Edit />
                        </button>
                        <button
                            className="btn-danger"
                            style={{ padding: '8px' }}
                            onClick={(e) => handleActionClick(e, () => onDelete(prompt.id))}
                            title="Sil"
                        >
                            <Icons.Trash />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
