// Database types (matching Prisma schema)
export interface Media {
    id: string;
    promptId: string;
    type: 'image' | 'video' | 'gif';
    url: string;
    localPath?: string | null;
    thumbnailPath?: string | null;
    createdAt: Date;
}

export interface Prompt {
    id: string;
    tweetUrl?: string | null;
    tweetId?: string | null;
    promptText: string;
    tags: string[];
    author?: string | null;
    authorHandle?: string | null;
    createdAt: Date;
    updatedAt: Date;
    media: Media[];
}

// API Response types
export interface MediaItem {
    type: 'image' | 'video' | 'gif';
    url: string;
    thumbnailUrl?: string;
}

export interface TweetData {
    text: string;
    imageUrl?: string;
    videoUrl?: string;
    media?: MediaItem[];
    author?: string;
    authorHandle?: string;
    autoTags?: string[];
    tweetId?: string;
}

// Form/Input types
export interface CreatePromptInput {
    tweetUrl?: string;
    tweetId?: string;
    promptText: string;
    tags: string[];
    author?: string;
    authorHandle?: string;
    mediaItems?: {
        type: 'image' | 'video' | 'gif';
        url: string;
        thumbnailUrl?: string;
    }[];
}

export interface UpdatePromptInput {
    promptText?: string;
    tags?: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
