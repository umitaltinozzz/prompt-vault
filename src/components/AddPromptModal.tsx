'use client';

import { useState, useCallback } from 'react';
import { TweetData, MediaItem } from '@/types';
import { Icons } from './Icons';
import { useTweetFetch, useMediaUpload } from '@/hooks/usePrompts';
import { extractTweetId } from '@/lib/utils';

interface AddPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        tweetUrl?: string;
        tweetId?: string;
        promptText: string;
        tags: string[];
        author?: string;
        authorHandle?: string;
        mediaItems?: MediaItem[];
    }) => Promise<void>;
    existingTweetIds: string[];
}

export function AddPromptModal({
    isOpen,
    onClose,
    onSave,
    existingTweetIds,
}: AddPromptModalProps) {
    const [tweetUrl, setTweetUrl] = useState('');
    const [promptText, setPromptText] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { isLoading: isFetching, tweetData, fetchTweet, reset } = useTweetFetch();
    const { isUploading, uploadMedia } = useMediaUpload();

    const handleFetch = useCallback(async () => {
        if (!tweetUrl.trim()) return;

        const tweetId = extractTweetId(tweetUrl);
        if (!tweetId) {
            alert('Geçersiz tweet URL\'i');
            return;
        }

        if (existingTweetIds.includes(tweetId)) {
            alert('Bu tweet zaten kaydedilmiş');
            return;
        }

        const data = await fetchTweet(tweetUrl);
        if (data) {
            setPromptText(data.text || '');
            if (data.autoTags?.length) {
                setTags(data.autoTags.join(', '));
            }
        }
    }, [tweetUrl, existingTweetIds, fetchTweet]);

    const handleSave = useCallback(async () => {
        if (!promptText.trim()) {
            alert('Prompt metni gerekli');
            return;
        }

        setIsSaving(true);
        try {
            // Collect ALL media URLs to upload (images + videos)
            const mediaUrls: string[] = [];
            if (tweetData?.media) {
                tweetData.media.forEach((m) => {
                    // Always add main URL (image or video)
                    mediaUrls.push(m.url);
                    // Also add thumbnail for videos
                    if (m.type !== 'image' && m.thumbnailUrl) {
                        mediaUrls.push(m.thumbnailUrl);
                    }
                });
            }

            // Upload ALL media (images + videos) to local storage
            let uploadedMedia: MediaItem[] = tweetData?.media || [];
            if (mediaUrls.length > 0) {
                const uploaded = await uploadMedia(mediaUrls);
                uploadedMedia = (tweetData?.media || []).map((m) => {
                    // Find uploaded main media (image or video)
                    const mainUpload = uploaded.find((u) => u.originalUrl === m.url);
                    // Find uploaded thumbnail (for videos)
                    const thumbUpload = uploaded.find((u) => u.originalUrl === m.thumbnailUrl);

                    return {
                        ...m,
                        url: mainUpload?.publicUrl || m.url,
                        thumbnailUrl: thumbUpload?.publicUrl || m.thumbnailUrl,
                    };
                });
            }

            await onSave({
                tweetUrl: tweetUrl || undefined,
                tweetId: extractTweetId(tweetUrl) || undefined,
                promptText: promptText.trim(),
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                author: tweetData?.author,
                authorHandle: tweetData?.authorHandle,
                mediaItems: uploadedMedia,
            });

            handleClose();
        } finally {
            setIsSaving(false);
        }
    }, [promptText, tags, tweetUrl, tweetData, uploadMedia, onSave]);

    const handleClose = useCallback(() => {
        setTweetUrl('');
        setPromptText('');
        setTags('');
        reset();
        onClose();
    }, [onClose, reset]);

    if (!isOpen) return null;

    const isLoading = isFetching || isUploading || isSaving;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="modal-content">
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
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Yeni Prompt Ekle</h2>
                    <button
                        onClick={handleClose}
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
                <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* Tweet URL */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Twitter/X Linki
                        </label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="url"
                                className="input-glass"
                                placeholder="https://x.com/username/status/..."
                                value={tweetUrl}
                                onChange={(e) => setTweetUrl(e.target.value)}
                                disabled={isLoading}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn-primary"
                                onClick={handleFetch}
                                disabled={isLoading || !tweetUrl.trim()}
                                style={{ flexShrink: 0 }}
                            >
                                {isFetching ? <div className="spinner" /> : 'Çek'}
                            </button>
                        </div>
                    </div>

                    {/* Media Preview */}
                    {tweetData?.media && tweetData.media.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                                Medya ({tweetData.media.length})
                            </label>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: tweetData.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '8px',
                                }}
                            >
                                {tweetData.media.map((item, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'var(--color-bg-primary)',
                                            position: 'relative',
                                            aspectRatio: tweetData.media!.length > 1 ? '1' : '16/9',
                                        }}
                                    >
                                        {item.type === 'image' ? (
                                            <img
                                                src={item.url}
                                                alt={`Görsel ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <img
                                                    src={item.thumbnailUrl || ''}
                                                    alt="Video thumbnail"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
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
                                                            width: '50px',
                                                            height: '50px',
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
                                                    🎬 Video
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prompt Text */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Prompt Metni
                        </label>
                        <textarea
                            className="input-glass"
                            placeholder="AI prompt metnini girin..."
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            rows={6}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                            Etiketler (virgülle ayırın)
                        </label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="midjourney, portrait, cinematic"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isLoading || !promptText.trim()}
                        style={{ width: '100%' }}
                    >
                        {isSaving ? (
                            <>
                                <div className="spinner" /> Kaydediliyor...
                            </>
                        ) : isUploading ? (
                            <>
                                <div className="spinner" /> Medya yükleniyor...
                            </>
                        ) : (
                            'Kaydet'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
