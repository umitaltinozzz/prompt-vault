'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prompt, CreatePromptInput, UpdatePromptInput, TweetData, MediaItem } from '@/types';

export function usePrompts() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all prompts
    const fetchPrompts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/prompts');
            const result = await response.json();

            if (result.success) {
                setPrompts(result.data);
            } else {
                setError(result.error);
            }
        } catch (e) {
            setError('Promptlar yüklenemedi');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create prompt
    const createPrompt = useCallback(async (input: CreatePromptInput): Promise<Prompt | null> => {
        try {
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            const result = await response.json();

            if (result.success) {
                setPrompts((prev) => [result.data, ...prev]);
                return result.data;
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error('Create prompt failed:', e);
            throw e;
        }
    }, []);

    // Update prompt
    const updatePrompt = useCallback(async (id: string, input: UpdatePromptInput): Promise<Prompt | null> => {
        try {
            const response = await fetch(`/api/prompts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            const result = await response.json();

            if (result.success) {
                setPrompts((prev) =>
                    prev.map((p) => (p.id === id ? result.data : p))
                );
                return result.data;
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error('Update prompt failed:', e);
            throw e;
        }
    }, []);

    // Delete prompt
    const deletePrompt = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/prompts/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setPrompts((prev) => prev.filter((p) => p.id !== id));
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error('Delete prompt failed:', e);
            throw e;
        }
    }, []);

    // Load prompts on mount
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    return {
        prompts,
        isLoading,
        error,
        fetchPrompts,
        createPrompt,
        updatePrompt,
        deletePrompt,
    };
}

// Hook for fetching tweet data
export function useTweetFetch() {
    const [isLoading, setIsLoading] = useState(false);
    const [tweetData, setTweetData] = useState<TweetData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTweet = useCallback(async (tweetUrl: string): Promise<TweetData | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Fetch tweet metadata
            const response = await fetch(`/api/tweet?url=${encodeURIComponent(tweetUrl)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Tweet çekilemedi');
            }

            // 2. Try to get video URL from Cobalt if tweet has video
            let cobaltVideoUrl = '';
            if (data.videoUrl || data.media?.some((m: MediaItem) => m.type === 'video')) {
                try {
                    const videoResponse = await fetch('/api/download-video', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tweetUrl }),
                    });

                    if (videoResponse.ok) {
                        const videoData = await videoResponse.json();
                        if (videoData.videoUrl) {
                            cobaltVideoUrl = videoData.videoUrl;
                        }
                    }
                } catch (e) {
                    console.log('Cobalt video fetch failed, using original URL');
                }
            }

            const result: TweetData = {
                ...data,
                videoUrl: cobaltVideoUrl || data.videoUrl,
            };

            setTweetData(result);
            return result;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Tweet çekilemedi';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setTweetData(null);
        setError(null);
    }, []);

    return {
        isLoading,
        tweetData,
        error,
        fetchTweet,
        reset,
    };
}

// Hook for uploading media
export function useMediaUpload() {
    const [isUploading, setIsUploading] = useState(false);

    const uploadMedia = useCallback(async (urls: string[]): Promise<{
        originalUrl: string;
        publicUrl: string | null;
    }[]> => {
        if (urls.length === 0) return [];

        setIsUploading(true);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls }),
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            return result.data || [];
        } catch (e) {
            console.error('Media upload failed:', e);
            return urls.map((url) => ({ originalUrl: url, publicUrl: null }));
        } finally {
            setIsUploading(false);
        }
    }, []);

    return { isUploading, uploadMedia };
}
