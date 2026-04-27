import { NextRequest, NextResponse } from 'next/server';

// Sektör bazlı anahtar kelime haritası
const SECTOR_KEYWORDS: Record<string, string[]> = {
    'Yemek': ['yemek', 'food', 'restaurant', 'restoran', 'mutfak', 'kitchen', 'recipe', 'tarif', 'chef', 'şef', 'burger', 'pizza', 'kahve', 'coffee', 'cafe', 'kafe', 'lezzet', 'taste', 'menu', 'menü', 'tabak', 'dish', 'pişir', 'cook', 'bake', 'fırın'],
    'E-Ticaret': ['e-commerce', 'ecommerce', 'e-ticaret', 'eticaret', 'shop', 'store', 'mağaza', 'satış', 'sale', 'ürün', 'product', 'sepet', 'cart', 'checkout', 'online shop', 'marketplace', 'alışveriş', 'shopping', 'sipariş', 'order'],
    'Moda': ['fashion', 'moda', 'style', 'stil', 'giyim', 'clothing', 'dress', 'elbise', 'takım', 'suit', 'ayakkabı', 'shoes', 'aksesuar', 'accessory', 'trend', 'koleksiyon', 'collection', 'podyum', 'runway', 'outfit', 'kıyafet'],
    'Teknoloji': ['tech', 'technology', 'teknoloji', 'software', 'yazılım', 'app', 'uygulama', 'code', 'kod', 'developer', 'geliştirici', 'startup', 'saas', 'ai', 'yapay zeka', 'artificial', 'machine learning', 'data', 'veri', 'cloud', 'bulut', 'digital', 'dijital'],
    'Otomotiv': ['car', 'araba', 'otomobil', 'automobile', 'vehicle', 'araç', 'motor', 'engine', 'sürüş', 'drive', 'automotive', 'otomotiv', 'elektrikli', 'electric', 'tesla', 'bmw', 'mercedes', 'audi'],
    'Kozmetik': ['beauty', 'güzellik', 'kozmetik', 'cosmetic', 'makeup', 'makyaj', 'skincare', 'cilt bakım', 'serum', 'cream', 'krem', 'parfüm', 'perfume', 'saç', 'hair', 'nail', 'tırnak', 'spa'],
    'Finans': ['finance', 'finans', 'bank', 'banka', 'money', 'para', 'investment', 'yatırım', 'crypto', 'kripto', 'stock', 'hisse', 'trading', 'forex', 'budget', 'bütçe', 'kredi', 'credit', 'loan'],
    'Sağlık': ['health', 'sağlık', 'medical', 'tıbbi', 'doctor', 'doktor', 'hospital', 'hastane', 'medicine', 'ilaç', 'wellness', 'fitness', 'spor', 'gym', 'egzersiz', 'exercise', 'vitamin', 'supplement'],
    'Eğitim': ['education', 'eğitim', 'learn', 'öğren', 'course', 'kurs', 'school', 'okul', 'university', 'üniversite', 'student', 'öğrenci', 'teacher', 'öğretmen', 'online course', 'tutorial', 'ders'],
    'Gayrimenkul': ['real estate', 'emlak', 'gayrimenkul', 'property', 'mülk', 'house', 'ev', 'apartment', 'daire', 'villa', 'konut', 'housing', 'rent', 'kira', 'satılık', 'kiralık', 'interior', 'iç mekan'],
    'Seyahat': ['travel', 'seyahat', 'tourism', 'turizm', 'hotel', 'otel', 'flight', 'uçuş', 'vacation', 'tatil', 'destination', 'beach', 'plaj', 'trip', 'gezi', 'adventure', 'macera', 'booking'],
    'Sanat': ['art', 'sanat', 'design', 'tasarım', 'creative', 'yaratıcı', 'illustration', 'illüstrasyon', 'painting', 'resim', 'drawing', 'çizim', 'gallery', 'galeri', 'artist', 'sanatçı', 'graphic', 'grafik'],
    'Gaming': ['game', 'oyun', 'gaming', 'gamer', 'esports', 'console', 'pc game', 'mobile game', 'streamer', 'twitch', 'playstation', 'xbox', 'nintendo', 'rpg', 'fps'],
    'Müzik': ['music', 'müzik', 'song', 'şarkı', 'album', 'albüm', 'concert', 'konser', 'artist', 'band', 'spotify', 'playlist', 'audio', 'ses', 'podcast', 'radio', 'dj'],
    'Sosyal Medya': ['social media', 'sosyal medya', 'instagram', 'tiktok', 'youtube', 'twitter', 'influencer', 'content creator', 'içerik', 'viral', 'hashtag', 'follower', 'takipçi', 'engagement'],
    'AI Görsel': ['midjourney', 'dall-e', 'dalle', 'stable diffusion', 'kling', 'runway', 'pika', 'sora', 'ai art', 'ai image', 'ai video', 'generated', 'prompt', 'lora', 'comfyui', 'automatic1111', 'eachlabs', 'leonardo', 'ideogram', 'flux'],
};

// AI Araç etiketleri
const AI_TOOLS: Record<string, string[]> = {
    'Midjourney': ['midjourney', 'mj', '--ar', '--v ', '--style'],
    'DALL-E': ['dall-e', 'dalle', 'openai'],
    'Stable Diffusion': ['stable diffusion', 'sd', 'sdxl', 'automatic1111', 'comfyui', 'controlnet'],
    'Kling': ['kling', 'kling ai'],
    'Runway': ['runway', 'gen-2', 'gen-3'],
    'Pika': ['pika', 'pika labs'],
    'Sora': ['sora', 'openai sora'],
    'Leonardo': ['leonardo', 'leonardo.ai'],
    'Ideogram': ['ideogram'],
    'Flux': ['flux', 'black forest'],
    'EachLabs': ['eachlabs', 'each labs'],
};

// Stil etiketleri
const STYLE_KEYWORDS: Record<string, string[]> = {
    'Fotogerçekçi': ['photorealistic', 'realistic', 'hyperrealistic', 'gerçekçi', 'foto', 'photo'],
    '3D': ['3d', 'three dimensional', 'render', 'blender', 'c4d', 'cinema4d', 'octane'],
    'Anime': ['anime', 'manga', 'japanese', 'cel shaded'],
    'Minimalist': ['minimal', 'minimalist', 'simple', 'clean'],
    'Vintage': ['vintage', 'retro', 'nostalgic', 'old school', '80s', '90s'],
    'Neon': ['neon', 'cyberpunk', 'futuristic', 'synthwave', 'vaporwave'],
    'Sinematik': ['cinematic', 'sinematik', 'movie', 'film', 'dramatic lighting'],
    'İzometrik': ['isometric', 'izometrik', 'iso'],
    'Flat Design': ['flat', 'flat design', '2d', 'vector'],
    'Suluboya': ['watercolor', 'suluboya', 'aquarelle'],
    'Sketch': ['sketch', 'eskiz', 'pencil', 'karakalem', 'drawing'],
};

interface MediaItem {
    type: 'image' | 'video' | 'gif';
    url: string;
    thumbnailUrl?: string;
}

function extractSectors(text: string): string[] {
    const lowerText = text.toLowerCase();
    const foundSectors: string[] = [];

    for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                if (!foundSectors.includes(sector)) {
                    foundSectors.push(sector);
                }
                break;
            }
        }
    }

    return foundSectors;
}

function extractAITools(text: string): string[] {
    const lowerText = text.toLowerCase();
    const foundTools: string[] = [];

    for (const [tool, keywords] of Object.entries(AI_TOOLS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                if (!foundTools.includes(tool)) {
                    foundTools.push(tool);
                }
                break;
            }
        }
    }

    return foundTools;
}

function extractStyles(text: string): string[] {
    const lowerText = text.toLowerCase();
    const foundStyles: string[] = [];

    for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                if (!foundStyles.includes(style)) {
                    foundStyles.push(style);
                }
                break;
            }
        }
    }

    return foundStyles;
}

function generateAutoTags(text: string): string[] {
    const sectors = extractSectors(text);
    const tools = extractAITools(text);
    const styles = extractStyles(text);

    // Combine all tags, limit to 6
    const allTags = [...tools, ...sectors, ...styles];
    return allTags.slice(0, 6);
}

import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tweetUrl = searchParams.get('url');

    if (!tweetUrl) {
        return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
    }

    try {
        // Extract tweet ID from URL - handle /i/status/ format too
        const tweetIdMatch = tweetUrl.match(/status\/(\d+)/);
        if (!tweetIdMatch) {
            return NextResponse.json({ error: 'Geçersiz tweet URL\'i' }, { status: 400 });
        }
        const tweetId = tweetIdMatch[1];

        let extractedText = '';
        let authorName = '';
        let authorHandle = '';
        const mediaItems: MediaItem[] = [];

        // Primary: Use vxtwitter/fxtwitter API for best media access
        try {
            const vxUrl = `https://api.vxtwitter.com/twitter/status/${tweetId}`;
            const vxResponse = await fetch(vxUrl, {
                headers: {
                    'User-Agent': 'PromptVault/1.0'
                }
            });

            if (vxResponse.ok) {
                const vxData = await vxResponse.json();

                // Get text
                extractedText = vxData.text || '';

                // Get author info
                authorName = vxData.user_name || '';
                authorHandle = vxData.user_screen_name || '';

                // Get ALL media items
                if (vxData.media_extended && vxData.media_extended.length > 0) {
                    for (const media of vxData.media_extended) {
                        if (media.type === 'image') {
                            mediaItems.push({
                                type: 'image',
                                url: media.url,
                            });
                        } else if (media.type === 'video') {
                            mediaItems.push({
                                type: 'video',
                                url: media.url,
                                thumbnailUrl: media.thumbnail_url,
                            });
                        } else if (media.type === 'gif') {
                            mediaItems.push({
                                type: 'gif',
                                url: media.url,
                                thumbnailUrl: media.thumbnail_url,
                            });
                        }
                    }
                }

                // Fallback to mediaURLs array if no media_extended
                if (mediaItems.length === 0 && vxData.mediaURLs && vxData.mediaURLs.length > 0) {
                    for (const url of vxData.mediaURLs) {
                        // Guess type from URL
                        if (url.includes('.mp4') || url.includes('video')) {
                            mediaItems.push({ type: 'video', url });
                        } else {
                            mediaItems.push({ type: 'image', url });
                        }
                    }
                }
            }
        } catch (e) {
            console.log('vxtwitter API failed:', e);
        }

        // Fallback: Use fxtwitter if vxtwitter failed
        if (!extractedText) {
            try {
                const fxUrl = `https://api.fxtwitter.com/status/${tweetId}`;
                const fxResponse = await fetch(fxUrl);

                if (fxResponse.ok) {
                    const fxData = await fxResponse.json();
                    const tweet = fxData.tweet;

                    if (tweet) {
                        extractedText = tweet.text || '';
                        authorName = tweet.author?.name || '';
                        authorHandle = tweet.author?.screen_name || '';

                        // Get media from fxtwitter
                        if (tweet.media?.photos) {
                            for (const photo of tweet.media.photos) {
                                mediaItems.push({
                                    type: 'image',
                                    url: photo.url,
                                });
                            }
                        }
                        if (tweet.media?.videos) {
                            for (const video of tweet.media.videos) {
                                mediaItems.push({
                                    type: 'video',
                                    url: video.url,
                                    thumbnailUrl: video.thumbnail_url,
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                console.log('fxtwitter API failed:', e);
            }
        }

        // Last fallback: Twitter oEmbed (no media)
        if (!extractedText) {
            try {
                const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=true`;
                const oembedResponse = await fetch(oembedUrl);

                if (oembedResponse.ok) {
                    const oembedData = await oembedResponse.json();
                    const htmlContent = oembedData.html || '';

                    const textMatch = htmlContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);
                    if (textMatch) {
                        extractedText = textMatch[1]
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'")
                            .replace(/\s+/g, ' ')
                            .trim();
                    }

                    authorName = oembedData.author_name || '';
                    authorHandle = oembedData.author_url?.split('/').pop() || '';
                }
            } catch (e) {
                console.log('oEmbed API failed:', e);
            }
        }

        if (!extractedText) {
            return NextResponse.json(
                { error: 'Tweet içeriği çekilemedi. Lütfen URL\'i kontrol edin.' },
                { status: 404 }
            );
        }

        // Generate auto tags based on content
        const autoTags = generateAutoTags(extractedText);

        // Get primary image (first image or first video thumbnail)
        let primaryImageUrl = '';
        let primaryVideoUrl = '';

        for (const item of mediaItems) {
            if (item.type === 'image' && !primaryImageUrl) {
                primaryImageUrl = item.url;
            } else if ((item.type === 'video' || item.type === 'gif') && !primaryVideoUrl) {
                primaryVideoUrl = item.url;
                if (!primaryImageUrl && item.thumbnailUrl) {
                    primaryImageUrl = item.thumbnailUrl;
                }
            }
        }

        return NextResponse.json({
            text: extractedText,
            imageUrl: primaryImageUrl,
            videoUrl: primaryVideoUrl,
            media: mediaItems, // All media items
            author: authorName,
            authorHandle,
            tweetId,
            autoTags,
        });

    } catch (error) {
        console.error('Tweet fetch error:', error);
        return NextResponse.json(
            { error: 'Tweet çekilirken hata oluştu. Lütfen URL\'i kontrol edin.' },
            { status: 500 }
        );
    }
}
