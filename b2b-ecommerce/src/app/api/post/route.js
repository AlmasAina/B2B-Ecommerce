// api/posts/route.js - Updated with Media Support
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Post from '@/app/models/Post';
import Category from '@/app/models/Category';
import Tag from '@/app/models/Tag';
import Media from '@/app/models/Media';

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const author = searchParams.get('author');
        const template = searchParams.get('template');
        const featured = searchParams.get('featured');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;
        const includeMedia = searchParams.get('includeMedia') === 'true';

        // Build query
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') {
            const categoryDoc = await Category.findOne({
                $or: [{ name: category }, { slug: category }]
            });
            if (categoryDoc) {
                query.categories = categoryDoc._id;
            }
        }

        if (tag && tag !== 'all') {
            const tagDoc = await Tag.findOne({
                $or: [{ name: tag }, { slug: tag }]
            });
            if (tagDoc) {
                query.tags = tagDoc._id;
            }
        }

        if (author) {
            query.author = author;
        }

        if (template) {
            query.template = template;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Build the base query
        let postQuery = Post.find(query)
            .populate('categories', 'name slug')
            .populate('tags', 'name slug');

        // Add media population if requested
        if (includeMedia) {
            postQuery = postQuery
                .populate({
                    path: 'featuredImage.media',
                    model: 'Media',
                    select: 'filename originalName url type size alt caption'
                })
                .populate({
                    path: 'mediaItems.media',
                    model: 'Media',
                    select: 'filename originalName url type size alt caption'
                })
                .populate({
                    path: 'socialEmbeds.mediaId',
                    model: 'Media',
                    select: 'filename originalName url type embedData'
                })
                .populate({
                    path: 'metaImage',
                    model: 'Media',
                    select: 'filename originalName url alt'
                });
        }

        // Execute query
        const posts = await postQuery
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Post.countDocuments(query);

        // Get status counts for tabs
        const statusCounts = await Post.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const counts = {
            all: 0,
            published: 0,
            draft: 0,
            private: 0,
            trash: 0,
            scheduled: 0
        };

        statusCounts.forEach(item => {
            if (item._id) {
                counts[item._id] = item.count;
                counts.all += item.count;
            }
        });

        return NextResponse.json({
            success: true,
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            statusCounts: counts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
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

        // Validate required fields
        const { title, content } = body;
        if (!title || !title.trim()) {
            return NextResponse.json(
                { success: false, error: 'Title is required' },
                { status: 400 }
            );
        }

        // Handle categories - convert names to ObjectIds
        let categoryIds = [];
        if (body.categories && Array.isArray(body.categories)) {
            for (let categoryName of body.categories) {
                let category = await Category.findOne({ name: categoryName });
                if (!category) {
                    category = await Category.create({
                        name: categoryName,
                        slug: categoryName.toLowerCase().replace(/\s+/g, '-')
                    });
                }
                categoryIds.push(category._id);
            }
        }

        // Handle tags - convert names to ObjectIds
        let tagIds = [];
        if (body.tags && Array.isArray(body.tags)) {
            for (let tagName of body.tags) {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({
                        name: tagName,
                        slug: tagName.toLowerCase().replace(/\s+/g, '-')
                    });
                }
                tagIds.push(tag._id);
            }
        }

        // Handle media items
        let mediaItems = [];
        if (body.mediaItems && Array.isArray(body.mediaItems)) {
            mediaItems = body.mediaItems.map(item => ({
                media: item.mediaId || item.media,
                role: item.role || 'attachment',
                order: item.order || 0,
                caption: item.caption || '',
                alt: item.alt || ''
            }));
        }

        // Handle featured image
        let featuredImage = null;
        if (body.featuredImage) {
            if (typeof body.featuredImage === 'string') {
                // Old format - just URL
                featuredImage = {
                    media: body.featuredImageId || null,
                    alt: body.featuredImageAlt || '',
                    caption: body.featuredImageCaption || ''
                };
            } else {
                // New format - object with media reference
                featuredImage = {
                    media: body.featuredImage.mediaId || body.featuredImage.media,
                    alt: body.featuredImage.alt || '',
                    caption: body.featuredImage.caption || ''
                };
            }
        }

        // Handle social embeds
        let socialEmbeds = [];
        if (body.socialEmbeds && Array.isArray(body.socialEmbeds)) {
            socialEmbeds = body.socialEmbeds.map(embed => ({
                platform: embed.platform,
                url: embed.url,
                embedCode: embed.embedCode || '',
                mediaId: embed.mediaId || null
            }));
        }

        // Create new post
        const postData = {
            title: title.trim(),
            content: body.content || '',
            excerpt: body.excerpt || '',
            status: body.status || 'draft',
            visibility: body.visibility || 'public',
            publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
            scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
            author: body.author || 'Admin',
            categories: categoryIds,
            tags: tagIds,

            // Media fields
            featuredImage: featuredImage,
            mediaItems: mediaItems,
            socialEmbeds: socialEmbeds,
            metaImage: body.metaImageId || null,

            // Content blocks
            contentBlocks: Array.isArray(body.contentBlocks)
                ? body.contentBlocks.map(block => ({
                    type: block.type || 'text',
                    content: block.content || '',
                    mediaId: block.mediaId || null,
                    settings: block.settings || {},
                    order: block.order || 0
                }))
                : [],

            // Styling and layout
            mediaSize: body.mediaSize || 'medium',
            textAlignment: body.textAlignment || 'left',
            fontSize: body.fontSize || 'medium',
            fontColor: body.fontColor || '#000000',
            bold: Boolean(body.bold),
            italic: Boolean(body.italic),
            underline: Boolean(body.underline),
            layoutSettings: body.layoutSettings || 'left-right',

            // Links
            links: Array.isArray(body.links)
                ? body.links.filter(link => link.url && link.label).map(link => ({
                    url: link.url,
                    label: link.label,
                    type: link.type || 'external',
                    openInNewTab: link.openInNewTab !== false
                }))
                : [],

            // SEO
            metaDescription: body.metaDescription || '',
            metaKeywords: Array.isArray(body.metaKeywords) ? body.metaKeywords : [],

            // Settings
            allowComments: body.allowComments !== false,
            template: body.template || 'standard',
            isFeatured: Boolean(body.isFeatured),
            isSticky: Boolean(body.isSticky),

            // Custom fields
            customFields: Array.isArray(body.customFields)
                ? body.customFields.map(field => ({
                    key: field.key,
                    value: field.value,
                    type: field.type || 'text'
                }))
                : []
        };

        const post = await Post.create(postData);

        // Populate the response with media
        const populatedPost = await Post.findById(post._id)
            .populate('categories', 'name slug')
            .populate('tags', 'name slug')
            .populate({
                path: 'featuredImage.media',
                model: 'Media',
                select: 'filename originalName url type size alt caption'
            })
            .populate({
                path: 'mediaItems.media',
                model: 'Media',
                select: 'filename originalName url type size alt caption'
            });

        return NextResponse.json({
            success: true,
            post: populatedPost
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
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
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Validate required fields
        const { title } = body;
        if (!title || !title.trim()) {
            return NextResponse.json(
                { success: false, error: 'Title is required' },
                { status: 400 }
            );
        }

        // Create revision before updating
        const existingPost = await Post.findById(id);
        if (existingPost) {
            await existingPost.createRevision('Auto-save before update');
        }

        // Handle categories
        let categoryIds = [];
        if (body.categories && Array.isArray(body.categories)) {
            for (let categoryName of body.categories) {
                let category = await Category.findOne({ name: categoryName });
                if (!category) {
                    category = await Category.create({
                        name: categoryName,
                        slug: categoryName.toLowerCase().replace(/\s+/g, '-')
                    });
                }
                categoryIds.push(category._id);
            }
        }

        // Handle tags
        let tagIds = [];
        if (body.tags && Array.isArray(body.tags)) {
            for (let tagName of body.tags) {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({
                        name: tagName,
                        slug: tagName.toLowerCase().replace(/\s+/g, '-')
                    });
                }
                tagIds.push(tag._id);
            }
        }

        // Handle media items
        let mediaItems = [];
        if (body.mediaItems && Array.isArray(body.mediaItems)) {
            mediaItems = body.mediaItems.map(item => ({
                media: item.mediaId || item.media,
                role: item.role || 'attachment',
                order: item.order || 0,
                caption: item.caption || '',
                alt: item.alt || ''
            }));
        }

        // Handle featured image
        let featuredImage = null;
        if (body.featuredImage) {
            if (typeof body.featuredImage === 'string') {
                featuredImage = {
                    media: body.featuredImageId || null,
                    alt: body.featuredImageAlt || '',
                    caption: body.featuredImageCaption || ''
                };
            } else {
                featuredImage = {
                    media: body.featuredImage.mediaId || body.featuredImage.media,
                    alt: body.featuredImage.alt || '',
                    caption: body.featuredImage.caption || ''
                };
            }
        }

        // Update post
        const updateData = {
            title: title.trim(),
            content: body.content || '',
            excerpt: body.excerpt || '',
            status: body.status || 'draft',
            visibility: body.visibility || 'public',
            publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
            scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
            author: body.author || 'Admin',
            categories: categoryIds,
            tags: tagIds,
            featuredImage: featuredImage,
            mediaItems: mediaItems,
            socialEmbeds: body.socialEmbeds || [],
            metaImage: body.metaImageId || null,
            contentBlocks: Array.isArray(body.contentBlocks)
                ? body.contentBlocks.map(block => ({
                    type: block.type || 'text',
                    content: block.content || '',
                    mediaId: block.mediaId || null,
                    settings: block.settings || {},
                    order: block.order || 0
                }))
                : [],
            mediaSize: body.mediaSize || 'medium',
            textAlignment: body.textAlignment || 'left',
            fontSize: body.fontSize || 'medium',
            fontColor: body.fontColor || '#000000',
            bold: Boolean(body.bold),
            italic: Boolean(body.italic),
            underline: Boolean(body.underline),
            links: Array.isArray(body.links)
                ? body.links.filter(link => link.url && link.label).map(link => ({
                    url: link.url,
                    label: link.label,
                    type: link.type || 'external',
                    openInNewTab: link.openInNewTab !== false
                }))
                : [],
            layoutSettings: body.layoutSettings || 'left-right',
            allowComments: body.allowComments !== false,
            metaDescription: body.metaDescription || '',
            metaKeywords: Array.isArray(body.metaKeywords) ? body.metaKeywords : [],
            template: body.template || 'standard',
            isFeatured: Boolean(body.isFeatured),
            isSticky: Boolean(body.isSticky),
            customFields: Array.isArray(body.customFields)
                ? body.customFields.map(field => ({
                    key: field.key,
                    value: field.value,
                    type: field.type || 'text'
                }))
                : [],
            updatedAt: new Date()
        };

        const post = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
            .populate('categories', 'name slug')
            .populate('tags', 'name slug')
            .populate({
                path: 'featuredImage.media',
                model: 'Media',
                select: 'filename originalName url type size alt caption'
            })
            .populate({
                path: 'mediaItems.media',
                model: 'Media',
                select: 'filename originalName url type size alt caption'
            });

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error updating post:', error);
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
        const action = searchParams.get('action'); // 'trash' or 'permanent'

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Post ID is required' },
                { status: 400 }
            );
        }

        if (action === 'permanent') {
            // Permanent deletion
            const post = await Post.findByIdAndDelete(id);
            if (!post) {
                return NextResponse.json(
                    { success: false, error: 'Post not found' },
                    { status: 404 }
                );
            }
        } else {
            // Move to trash
            const post = await Post.findByIdAndUpdate(
                id,
                { status: 'trash' },
                { new: true }
            );
            if (!post) {
                return NextResponse.json(
                    { success: false, error: 'Post not found' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: action === 'permanent' ? 'Post permanently deleted' : 'Post moved to trash'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}