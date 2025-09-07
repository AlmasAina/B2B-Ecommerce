// models/Post.js - Updated with Media Support
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    excerpt: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },

    // Content blocks for advanced editing
    contentBlocks: [{
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'gallery', 'quote', 'code', 'embed'],
            default: 'text'
        },
        content: {
            type: String,
            default: ''
        },
        mediaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media'
        },
        settings: {
            type: Map,
            of: String,
            default: {}
        },
        order: {
            type: Number,
            default: 0
        }
    }],

    // Media attachments - NEW
    mediaItems: [{
        media: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true
        },
        role: {
            type: String,
            enum: ['featured', 'gallery', 'attachment', 'inline'],
            default: 'attachment'
        },
        order: {
            type: Number,
            default: 0
        },
        caption: String,
        alt: String
    }],

    // Featured image - now references Media
    featuredImage: {
        media: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media'
        },
        alt: String,
        caption: String
    },

    // Categories and Tags
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],

    // Author information
    author: {
        type: String,
        default: 'Admin'
    },

    // Publishing options
    status: {
        type: String,
        enum: ['draft', 'published', 'private', 'trash', 'scheduled'],
        default: 'draft'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'password'],
        default: 'public'
    },
    password: {
        type: String,
        default: ''
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    scheduledDate: {
        type: Date
    },

    // Media and formatting - ENHANCED
    mediaSize: {
        type: String,
        enum: ['small', 'medium', 'large', 'full'],
        default: 'medium'
    },
    textAlignment: {
        type: String,
        enum: ['left', 'center', 'right', 'justify'],
        default: 'left'
    },
    fontSize: {
        type: String,
        enum: ['small', 'medium', 'large', 'xl'],
        default: 'medium'
    },
    fontColor: {
        type: String,
        default: '#000000'
    },

    // Text styling
    bold: {
        type: Boolean,
        default: false
    },
    italic: {
        type: Boolean,
        default: false
    },
    underline: {
        type: Boolean,
        default: false
    },

    // Layout and links
    layoutSettings: {
        type: String,
        enum: ['left-right', 'right-left', 'center', 'full-width', 'grid'],
        default: 'left-right'
    },
    links: [{
        url: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['internal', 'external', 'download'],
            default: 'external'
        },
        openInNewTab: {
            type: Boolean,
            default: true
        }
    }],

    // Social media embeds - NEW
    socialEmbeds: [{
        platform: {
            type: String,
            enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'facebook', 'linkedin', 'vimeo'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        embedCode: String,
        mediaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media'
        }
    }],

    // SEO and meta
    metaDescription: {
        type: String,
        default: ''
    },
    metaKeywords: [{
        type: String
    }],
    metaImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },

    // Comments and engagement
    allowComments: {
        type: Boolean,
        default: true
    },
    commentCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },

    // Advanced features - NEW
    template: {
        type: String,
        enum: ['standard', 'gallery', 'video', 'audio', 'quote', 'link', 'aside'],
        default: 'standard'
    },
    customFields: [{
        key: String,
        value: String,
        type: {
            type: String,
            enum: ['text', 'number', 'date', 'boolean', 'url'],
            default: 'text'
        }
    }],

    // Revision history
    revisions: [{
        content: String,
        title: String,
        author: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        note: String
    }],

    // Reading time estimation
    readingTime: {
        type: Number,
        default: 0 // in minutes
    },

    // Content flags
    isFeatured: {
        type: Boolean,
        default: false
    },
    isSticky: {
        type: Boolean,
        default: false
    },

    // Analytics
    analytics: {
        avgTimeOnPage: Number,
        bounceRate: Number,
        topReferrers: [String],
        searchTerms: [String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
postSchema.index({ status: 1, publishDate: -1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ categories: 1, status: 1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ slug: 1 });
postSchema.index({ isFeatured: 1, status: 1 });

// Virtual for reading time calculation
postSchema.virtual('estimatedReadingTime').get(function () {
    if (this.readingTime) return this.readingTime;

    const wordsPerMinute = 200;
    const wordCount = this.content ? this.content.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
});

// Virtual for excerpt generation
postSchema.virtual('autoExcerpt').get(function () {
    if (this.excerpt) return this.excerpt;

    if (this.content) {
        // Strip HTML and get first 155 characters
        const plainText = this.content.replace(/<[^>]*>/g, '');
        return plainText.length > 155
            ? plainText.substring(0, 155) + '...'
            : plainText;
    }
    return '';
});

// Auto-generate slug from title if not provided
postSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 50);
    }

    // Calculate reading time
    if (this.content) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }

    next();
});

// Update category and tag counts when post is saved/updated
postSchema.post('save', async function () {
    const Category = mongoose.model('Category');
    const Tag = mongoose.model('Tag');

    // Update category counts
    for (let categoryId of this.categories) {
        const count = await this.constructor.countDocuments({
            categories: categoryId,
            status: 'published'
        });
        await Category.findByIdAndUpdate(categoryId, { count });
    }

    // Update tag counts
    for (let tagId of this.tags) {
        const count = await this.constructor.countDocuments({
            tags: tagId,
            status: 'published'
        });
        await Tag.findByIdAndUpdate(tagId, { count });
    }

    // Update media usage counts
    const Media = mongoose.model('Media');

    // Update featured image usage
    if (this.featuredImage?.media) {
        await Media.findByIdAndUpdate(this.featuredImage.media, {
            $inc: { usageCount: 1 },
            lastUsed: new Date()
        });
    }

    // Update media items usage
    for (let mediaItem of this.mediaItems) {
        if (mediaItem.media) {
            await Media.findByIdAndUpdate(mediaItem.media, {
                $inc: { usageCount: 1 },
                lastUsed: new Date()
            });
        }
    }

    // Update social embeds media usage
    for (let embed of this.socialEmbeds) {
        if (embed.mediaId) {
            await Media.findByIdAndUpdate(embed.mediaId, {
                $inc: { usageCount: 1 },
                lastUsed: new Date()
            });
        }
    }
});

// Static method to get posts with media
postSchema.statics.getWithMedia = function (query = {}, options = {}) {
    return this.find(query)
        .populate({
            path: 'featuredImage.media',
            model: 'Media'
        })
        .populate({
            path: 'mediaItems.media',
            model: 'Media'
        })
        .populate({
            path: 'socialEmbeds.mediaId',
            model: 'Media'
        })
        .populate('categories', 'name slug')
        .populate('tags', 'name slug')
        .sort(options.sort || { updatedAt: -1 })
        .limit(options.limit || 10)
        .skip(options.skip || 0);
};

// Method to add media to post
postSchema.methods.addMedia = function (mediaId, role = 'attachment', options = {}) {
    const mediaItem = {
        media: mediaId,
        role: role,
        order: this.mediaItems.length,
        caption: options.caption || '',
        alt: options.alt || ''
    };

    this.mediaItems.push(mediaItem);
    return this.save();
};

// Method to remove media from post
postSchema.methods.removeMedia = function (mediaId) {
    this.mediaItems = this.mediaItems.filter(item =>
        !item.media.equals(mediaId)
    );
    return this.save();
};

// Method to add social embed
postSchema.methods.addSocialEmbed = function (platform, url, embedCode = '', mediaId = null) {
    const embed = {
        platform,
        url,
        embedCode,
        mediaId
    };

    this.socialEmbeds.push(embed);
    return this.save();
};

// Method to create revision
postSchema.methods.createRevision = function (note = '') {
    const revision = {
        content: this.content,
        title: this.title,
        author: this.author,
        note: note
    };

    this.revisions.push(revision);

    // Keep only last 10 revisions
    if (this.revisions.length > 10) {
        this.revisions = this.revisions.slice(-10);
    }

    return this.save();
};

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
module.exports = Post;