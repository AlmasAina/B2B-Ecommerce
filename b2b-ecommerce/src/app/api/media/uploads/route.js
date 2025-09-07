// api/media/upload/route.js
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import dbConnect from '@/lib/dbConnect';
import Media from '@/app/models/Media';

// Configure upload settings
const UPLOAD_DIR = './public/uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
    document: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Helper function to get file type
function getFileType(mimetype) {
    for (const [type, mimetypes] of Object.entries(ALLOWED_TYPES)) {
        if (mimetypes.includes(mimetype)) {
            return type;
        }
    }
    return 'document';
}

// Helper function to generate unique filename
function generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, '_');
    return `${baseName}_${timestamp}_${random}${extension}`;
}

// Helper function to ensure directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Helper function to get image dimensions (basic implementation)
function getImageDimensions(buffer, mimetype) {
    // This is a simplified version - you might want to use a library like 'image-size'
    // For now, return default values
    return {
        width: null,
        height: null
    };
}

// Helper function to generate variants (thumbnails, etc.)
async function generateVariants(filePath, type, originalName) {
    const variants = [];

    if (type === 'image') {
        // TODO: Generate thumbnail, small, medium, large variants
        // This would typically use a library like Sharp or Jimp
        variants.push({
            size: 'original',
            url: `/uploads/${path.basename(filePath)}`,
            width: null,
            height: null,
            fileSize: null
        });
    }

    return variants;
}

export async function POST(req) {
    try {
        await dbConnect();
        await ensureUploadDir();

        const data = await req.formData();
        const files = data.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No files uploaded' },
                { status: 400 }
            );
        }

        const uploadedMedia = [];
        const errors = [];

        for (const file of files) {
            try {
                // Validate file
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name}: File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
                    continue;
                }

                const fileType = getFileType(file.type);
                if (!Object.values(ALLOWED_TYPES).flat().includes(file.type)) {
                    errors.push(`${file.name}: File type not allowed`);
                    continue;
                }

                // Generate unique filename
                const uniqueFilename = generateUniqueFilename(file.name);
                const filePath = path.join(UPLOAD_DIR, uniqueFilename);

                // Convert file to buffer and write to disk
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                await writeFile(filePath, buffer);

                // Get file metadata
                const metadata = {
                    width: null,
                    height: null,
                    duration: null,
                    aspectRatio: null
                };

                if (fileType === 'image') {
                    const dimensions = getImageDimensions(buffer, file.type);
                    metadata.width = dimensions.width;
                    metadata.height = dimensions.height;
                    if (dimensions.width && dimensions.height) {
                        metadata.aspectRatio = `${dimensions.width}:${dimensions.height}`;
                    }
                }

                // Generate variants
                const variants = await generateVariants(filePath, fileType, file.name);

                // Create media document
                const mediaData = {
                    filename: uniqueFilename,
                    originalName: file.name,
                    path: filePath,
                    url: `/uploads/${uniqueFilename}`,
                    mimetype: file.type,
                    size: file.size,
                    type: fileType,
                    metadata: metadata,
                    variants: variants,
                    alt: path.basename(file.name, path.extname(file.name)),
                    uploadedBy: data.get('uploadedBy') || 'Admin',
                    tags: data.get('tags') ? data.get('tags').split(',').map(tag => tag.trim()) : [],
                    storage: {
                        provider: 'local',
                        bucket: null,
                        key: uniqueFilename,
                        cdn: false
                    },
                    processing: {
                        status: 'completed',
                        progress: 100
                    },
                    isPublic: true,
                    requiresAuth: false
                };

                const media = await Media.create(mediaData);
                uploadedMedia.push(media);

            } catch (fileError) {
                console.error(`Error processing file ${file.name}:`, fileError);
                errors.push(`${file.name}: Upload failed - ${fileError.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            uploadedMedia,
            errors: errors.length > 0 ? errors : null,
            message: `${uploadedMedia.length} file(s) uploaded successfully${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`
        }, { status: 201 });

    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// Handle file updates (metadata only)
export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, alt, caption, description, tags } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Media ID is required' },
                { status: 400 }
            );
        }

        const updateData = {};
        if (alt !== undefined) updateData.alt = alt;
        if (caption !== undefined) updateData.caption = caption;
        if (description !== undefined) updateData.description = description;
        if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

        const media = await Media.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!media) {
            return NextResponse.json(
                { success: false, error: 'Media not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            media
        });
    } catch (error) {
        console.error('Error updating media:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}