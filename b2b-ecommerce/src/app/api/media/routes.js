// api/media/route.js
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Media from '@/app/models/Media';

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'image', 'video', 'audio', 'document', 'embed'
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const skip = (page - 1) * limit;
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const tags = searchParams.get('tags')?.split(',');

        // Build query
        let query = { deleted: false };

        if (type && type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { alt: { $regex: search, $options: 'i' } },
                { caption: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Get media items
        const mediaItems = await Media.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Media.countDocuments(query);

        // Get type counts for filters
        const typeCounts = await Media.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const counts = {
            all: total,
            image: 0,
            video: 0,
            audio: 0,
            document: 0,
            embed: 0
        };

        typeCounts.forEach(item => {
            if (item._id) {
                counts[item._id] = item.count;
            }
        });

        return NextResponse.json({
            success: true,
            mediaItems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            typeCounts: counts
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const { type } = body;

        // Handle embed media (YouTube, Instagram, etc.)
        if (type === 'embed') {
            const { url, platform, embedHtml, title, description, thumbnail } = body;

            if (!url) {
                return NextResponse.json(
                    { success: false, error: 'URL is required for embed media' },
                    { status: 400 }
                );
            }

            const mediaData = {
                filename: `embed-${Date.now()}`,
                originalName: title || url,
                path: '',
                url: url,
                mimetype: 'text/html',
                size: 0,
                type: 'embed',
                embedData: {
                    platform: platform || 'direct',
                    embedUrl: url,
                    embedHtml: embedHtml || '',
                    thumbnail: thumbnail || '',
                    title: title || '',
                    description: description || ''
                },
                alt: title || '',
                uploadedBy: body.uploadedBy || 'Admin'
            };

            const media = await Media.create(mediaData);
            return NextResponse.json({
                success: true,
                media
            }, { status: 201 });
        }

        // For other media types, this would typically be handled by the upload route
        return NextResponse.json(
            { success: false, error: 'Use /api/media/upload for file uploads' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error creating media:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

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

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const permanent = searchParams.get('permanent') === 'true';

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Media ID is required' },
                { status: 400 }
            );
        }

        if (permanent) {
            // Permanent deletion - also delete file from storage
            const media = await Media.findByIdAndDelete(id);
            if (!media) {
                return NextResponse.json(
                    { success: false, error: 'Media not found' },
                    { status: 404 }
                );
            }

            // TODO: Delete physical file from storage
            // This would depend on your storage solution (local, S3, etc.)

            return NextResponse.json({
                success: true,
                message: 'Media permanently deleted'
            });
        } else {
            // Soft delete
            const media = await Media.findByIdAndUpdate(
                id,
                {
                    deleted: true,
                    deletedAt: new Date()
                },
                { new: true }
            );

            if (!media) {
                return NextResponse.json(
                    { success: false, error: 'Media not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Media moved to trash'
            });
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}