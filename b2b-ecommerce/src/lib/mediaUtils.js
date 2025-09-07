// lib/mediaUtils.js - Media handling utilities

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Extract Instagram post ID from Instagram URL
 */
export function extractInstagramId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

/**
 * Extract TikTok video ID from TikTok URL
 */
export function extractTikTokId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

/**
 * Extract Twitter/X tweet ID from Twitter URL
 */
export function extractTwitterId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
    const platforms = [
        { name: 'youtube', patterns: ['youtube.com', 'youtu.be'] },
        { name: 'instagram', patterns: ['instagram.com'] },
        { name: 'tiktok', patterns: ['tiktok.com'] },
        { name: 'twitter', patterns: ['twitter.com', 'x.com'] },
        { name: 'vimeo', patterns: ['vimeo.com'] },
        { name: 'facebook', patterns: ['facebook.com', 'fb.com'] },
        { name: 'linkedin', patterns: ['linkedin.com'] }
    ];

    const lowercaseUrl = url.toLowerCase();

    for (const platform of platforms) {
        if (platform.patterns.some(pattern => lowercaseUrl.includes(pattern))) {
            return platform.name;
        }
    }

    return 'direct';
}

/**
 * Generate embed HTML for different platforms
 */
export function generateEmbedHtml(url, platform, options = {}) {
    const { width = 560, height = 315, autoplay = false } = options;

    switch (platform) {
        case 'youtube':
            const youtubeId = extractYouTubeId(url);
            if (!youtubeId) return null;

            const autoplayParam = autoplay ? '&autoplay=1' : '';
            return `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${youtubeId}?rel=0${autoplayParam}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

        case 'instagram':
            return `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"></script>`;

        case 'tiktok':
            const tiktokId = extractTikTokId(url);
            if (!tiktokId) return `<blockquote class="tiktok-embed" cite="${url}"></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;

            return `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${tiktokId}"></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;

        case 'twitter':
            return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;

        case 'vimeo':
            const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
            if (!vimeoMatch) return null;

            const vimeoId = vimeoMatch[1];
            return `<iframe src="https://player.vimeo.com/video/${vimeoId}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

        default:
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }
}

/**
 * Get thumbnail URL for embedded content
 */
export function getThumbnailUrl(url, platform) {
    switch (platform) {
        case 'youtube':
            const youtubeId = extractYouTubeId(url);
            return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

        case 'vimeo':
            const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
            return vimeoMatch ? `https://vumbnail.com/${vimeoMatch[1]}.jpg` : null;

        default:
            return null;
    }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type from mimetype
 */
export function getFileType(mimetype) {
    if (!mimetype) return 'unknown';

    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype.includes('pdf')) return 'pdf';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) return 'spreadsheet';
    if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return 'presentation';
    if (mimetype.includes('text/')) return 'text';
    if (mimetype.includes('json') || mimetype.includes('javascript')) return 'code';

    return 'file';
}

/**
 * Get appropriate icon for file type
 */
export function getFileIcon(type) {
    const icons = {
        image: 'image',
        video: 'video_library',
        audio: 'audiotrack',
        pdf: 'picture_as_pdf',
        document: 'description',
        spreadsheet: 'grid_on',
        presentation: 'slideshow',
        text: 'text_snippet',
        code: 'code',
        file: 'insert_drive_file',
        unknown: 'help_outline'
    };

    return icons[type] || icons.unknown;
}

/**
 * Validate file upload
 */
export function validateFile(file, options = {}) {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
        allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
        errors.push(`File size exceeds maximum limit of ${formatFileSize(maxSize)}`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`File type "${file.type}" is not allowed`);
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
        errors.push(`File extension "${extension}" is not allowed`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Generate secure filename
 */
export function generateSecureFilename(originalName, options = {}) {
    const {
        prefix = '',
        suffix = '',
        includeTimestamp = true,
        includeRandom = true,
        maxLength = 100
    } = options;

    const extension = originalName.includes('.')
        ? '.' + originalName.split('.').pop().toLowerCase()
        : '';

    let baseName = originalName.replace(/\.[^/.]+$/, "");

    // Remove unsafe characters
    baseName = baseName
        .replace(/[^a-zA-Z0-9\-_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

    // Ensure we have a name
    if (!baseName) {
        baseName = 'file';
    }

    // Build filename parts
    const parts = [];

    if (prefix) parts.push(prefix);
    parts.push(baseName);
    if (includeTimestamp) parts.push(Date.now().toString());
    if (includeRandom) parts.push(Math.random().toString(36).substring(2, 8));
    if (suffix) parts.push(suffix);

    let filename = parts.join('_') + extension;

    // Truncate if too long
    if (filename.length > maxLength) {
        const availableLength = maxLength - extension.length - 1;
        const truncatedBase = parts.join('_').substring(0, availableLength);
        filename = truncatedBase + extension;
    }

    return filename;
}

/**
 * Create media URL based on storage provider
 */
export function createMediaUrl(filename, storageProvider = 'local', options = {}) {
    const { cdnUrl, bucket, baseUrl = '/uploads' } = options;

    switch (storageProvider) {
        case 'local':
            return `${baseUrl}/${filename}`;

        case 'aws-s3':
            if (cdnUrl) {
                return `${cdnUrl}/${filename}`;
            }
            return `https://${bucket}.s3.amazonaws.com/${filename}`;

        case 'cloudinary':
            const { cloudName, transformations = '' } = options;
            return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${filename}`;

        case 'google-cloud':
            return `https://storage.googleapis.com/${bucket}/${filename}`;

        default:
            return `${baseUrl}/${filename}`;
    }
}

/**
 * Extract metadata from URL for social platforms
 */
export async function extractUrlMetadata(url) {
    const platform = detectPlatform(url);

    const metadata = {
        platform,
        url,
        title: '',
        description: '',
        thumbnail: '',
        embedHtml: '',
        duration: null,
        width: null,
        height: null
    };

    try {
        switch (platform) {
            case 'youtube':
                const youtubeId = extractYouTubeId(url);
                if (youtubeId) {
                    metadata.title = `YouTube Video - ${youtubeId}`;
                    metadata.thumbnail = getThumbnailUrl(url, platform);
                    metadata.embedHtml = generateEmbedHtml(url, platform);
                    metadata.width = 560;
                    metadata.height = 315;
                }
                break;

            case 'vimeo':
                const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                if (vimeoMatch) {
                    metadata.title = `Vimeo Video - ${vimeoMatch[1]}`;
                    metadata.thumbnail = getThumbnailUrl(url, platform);
                    metadata.embedHtml = generateEmbedHtml(url, platform);
                }
                break;

            case 'instagram':
                const instagramId = extractInstagramId(url);
                if (instagramId) {
                    metadata.title = `Instagram Post - ${instagramId}`;
                    metadata.embedHtml = generateEmbedHtml(url, platform);
                }
                break;

            case 'twitter':
                const twitterId = extractTwitterId(url);
                if (twitterId) {
                    metadata.title = `Twitter Post - ${twitterId}`;
                    metadata.embedHtml = generateEmbedHtml(url, platform);
                }
                break;

            case 'tiktok':
                const tiktokId = extractTikTokId(url);
                if (tiktokId) {
                    metadata.title = `TikTok Video - ${tiktokId}`;
                    metadata.embedHtml = generateEmbedHtml(url, platform);
                }
                break;

            default:
                metadata.title = url;
                metadata.embedHtml = generateEmbedHtml(url, platform);
        }
    } catch (error) {
        console.warn('Failed to extract metadata:', error);
    }

    return metadata;
}

/**
 * Generate responsive image sizes
 */
export function generateResponsiveSizes(originalWidth, originalHeight, breakpoints = [320, 768, 1024, 1440]) {
    const aspectRatio = originalHeight / originalWidth;

    return breakpoints.map(width => ({
        width,
        height: Math.round(width * aspectRatio),
        suffix: `_${width}w`
    }));
}

/**
 * Create image variants configuration
 */
export function createImageVariants() {
    return [
        { name: 'thumbnail', width: 150, height: 150, crop: true },
        { name: 'small', width: 300, height: null, crop: false },
        { name: 'medium', width: 600, height: null, crop: false },
        { name: 'large', width: 1200, height: null, crop: false },
        { name: 'original', width: null, height: null, crop: false }
    ];
}

/**
 * Check if URL is a direct media file
 */
export function isDirectMediaUrl(url) {
    const mediaExtensions = [
        // Images
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
        // Videos
        '.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv',
        // Audio
        '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'
    ];

    const urlPath = new URL(url).pathname.toLowerCase();
    return mediaExtensions.some(ext => urlPath.endsWith(ext));
}

/**
 * Sanitize alt text
 */
export function sanitizeAltText(text, maxLength = 125) {
    if (!text) return '';

    return text
        .replace(/[<>]/g, '') // Remove HTML brackets
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, maxLength);
}

/**
 * Generate media placeholder
 */
export function generatePlaceholder(width = 300, height = 200, text = 'Loading...') {
    return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.3em' fill='%23666666'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

export default {
    extractYouTubeId,
    extractInstagramId,
    extractTikTokId,
    extractTwitterId,
    detectPlatform,
    generateEmbedHtml,
    getThumbnailUrl,
    formatFileSize,
    getFileType,
    getFileIcon,
    validateFile,
    generateSecureFilename,
    createMediaUrl,
    extractUrlMetadata,
    generateResponsiveSizes,
    createImageVariants,
    isDirectMediaUrl,
    sanitizeAltText,
    generatePlaceholder
};