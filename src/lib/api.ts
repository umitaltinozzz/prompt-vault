import { MediaItem } from '@/types';

// Fetch tweet data from API
export async function fetchTweetData(tweetUrl: string) {
    const response = await fetch(`/api/tweet?url=${encodeURIComponent(tweetUrl)}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Tweet çekilemedi');
    }

    return data;
}

// Download video using Cobalt API
export async function downloadVideo(tweetUrl: string): Promise<{
    videoUrl?: string;
    audioUrl?: string;
    mediaItems?: { type: string; url: string; thumb?: string }[];
    error?: string;
}> {
    try {
        const response = await fetch('/api/download-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tweetUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Video indirilemedi' };
        }

        return data;
    } catch (e) {
        console.error('Video download failed:', e);
        return { error: 'Video indirme hatası' };
    }
}

// Download images and convert to base64
export async function downloadImages(imageUrls: string[]): Promise<{
    images: { url: string; base64: string | null; type: string }[];
}> {
    if (imageUrls.length === 0) {
        return { images: [] };
    }

    try {
        const response = await fetch('/api/download-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls }),
        });

        if (!response.ok) {
            return { images: [] };
        }

        return await response.json();
    } catch (e) {
        console.error('Failed to download images:', e);
        return { images: [] };
    }
}

// Download video and convert to base64 (for small videos/gifs)
export async function downloadVideoAsBase64(videoUrl: string): Promise<string | null> {
    try {
        const response = await fetch('/api/download-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls: [videoUrl] }),
        });

        if (response.ok) {
            const { images } = await response.json();
            if (images[0]?.base64) {
                return images[0].base64;
            }
        }
    } catch (e) {
        console.error('Failed to download video:', e);
    }
    return null;
}

// Collect image URLs from media items
export function collectImageUrls(media?: MediaItem[], imageUrl?: string): string[] {
    const urls: string[] = [];

    if (media) {
        media.forEach(item => {
            if (item.type === 'image') {
                urls.push(item.url);
            } else if (item.thumbnailUrl) {
                urls.push(item.thumbnailUrl);
            }
        });
    } else if (imageUrl) {
        urls.push(imageUrl);
    }

    return urls;
}

// Map downloaded base64 images back to media items
export function mapDownloadedMedia(
    originalMedia: MediaItem[],
    downloadedImages: { url: string; base64: string | null }[]
): MediaItem[] {
    return originalMedia.map(item => {
        const downloaded = downloadedImages.find(
            img => img.url === item.url || img.url === item.thumbnailUrl
        );
        if (downloaded?.base64) {
            if (item.type === 'image') {
                return { ...item, url: downloaded.base64 };
            } else {
                return { ...item, thumbnailUrl: downloaded.base64 };
            }
        }
        return item;
    });
}
