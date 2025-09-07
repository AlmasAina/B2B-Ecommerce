// next.config.js - Next.js configuration for file uploads
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['mongoose']
    },

    // Configure static file serving
    images: {
        domains: [
            'localhost',
            'your-domain.com', // Add your production domain
            'res.cloudinary.com', // If using Cloudinary
            'your-cdn-domain.com' // If using a CDN
        ],
        formats: ['image/webp', 'image/avif'],
    },

    // Handle API routes body size limits
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },

    // Static file serving configuration
    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: '/api/static/:path*', // Optional: create a custom static handler
            },
        ];
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/uploads/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/api/upload',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // Configure this properly for production
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

// middleware.js - Optional middleware for file upload security
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request) {
    // Handle file upload security
    if (request.nextUrl.pathname.startsWith('/api/upload')) {
        // Add rate limiting, authentication checks, etc.
        const origin = request.headers.get('origin');

        // CORS handling
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': origin || '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        // Add authentication check here if needed
        // const token = request.headers.get('authorization');
        // if (!token) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/upload/:path*', '/api/products/:path*']
};

// lib/fileUpload.js - Utility functions for file handling
import { promises as fs } from 'fs';
import path from 'path';

export const UPLOAD_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
    uploadDir: path.join(process.cwd(), 'public/uploads'),
};

export const validateFileType = (mimetype) => {
    return [
        ...UPLOAD_CONFIG.allowedImageTypes,
        ...UPLOAD_CONFIG.allowedVideoTypes
    ].includes(mimetype);
};

export const getFileCategory = (mimetype) => {
    if (UPLOAD_CONFIG.allowedImageTypes.includes(mimetype)) return 'images';
    if (UPLOAD_CONFIG.allowedVideoTypes.includes(mimetype)) return 'videos';
    return 'other';
};

export const ensureUploadDirectories = async () => {
    const dirs = ['images', 'videos', 'thumbnails'];

    for (const dir of dirs) {
        const dirPath = path.join(UPLOAD_CONFIG.uploadDir, dir);
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }
};

export const generateFileName = (originalName, mimetype) => {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}${ext}`;
};

export const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

// Optional: Image processing utility (requires sharp package)
// npm install sharp
/*
import sharp from 'sharp';

export const processImage = async (buffer, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 85,
    format = 'webp'
  } = options;

  try {
    const processed = await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toBuffer();

    return {
      buffer: processed,
      info: await sharp(processed).metadata()
    };
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

export const generateThumbnail = async (buffer, size = 150) => {
  try {
    const thumbnail = await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('webp', { quality: 80 })
      .toBuffer();

    return thumbnail;
  } catch (error) {
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};
*/

// package.json dependencies you'll need to add:
/*
{
  "dependencies": {
    "uuid": "^9.0.0",
    "sharp": "^0.32.0", // Optional: for image processing
    "ffprobe": "^1.1.2", // Optional: for video metadata
    "multer": "^1.4.5-lts.1" // Alternative to built-in FormData
  }
}
*/

// Environment variables (.env.local)
/*
# File Upload Configuration
UPLOAD_MAX_FILE_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp,video/mp4

# If using cloud storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# If using AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
*/