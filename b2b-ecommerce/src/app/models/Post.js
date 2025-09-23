// models/Post.js - Updated with Media Support + Unique Slug Fix
const mongoose = require('mongoose');
const Media = require('./Media'); // 👈 Import Media so schema is registered
const slugify = require('slugify'); // 👈 Install this: npm install slugify

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    slug: { type: String, unique: true, sparse: true },

    // Content blocks
    contentBlocks: [{
        type: { type: String, enum: ['text', 'image', 'video', 'gallery', 'quote', 'code', 'embed'], default: 'text' },
        content: { type: String, default: '' },
        mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
        settings: { type: Map, of: String, default: {} },
        order: { type: Number, default: 0 }
    }],

    // Media attachments
    mediaItems: [{
        media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
        role: { type: String, enum: ['featured', 'gallery', 'attachment', 'inline'], default: 'attachment' },
        order: { type: Number, default: 0 },
        caption: String,
        alt: String
    }],

    // Featured image
    featuredImage: {
        media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
        alt: String,
        caption: String
    },

    // Categories & Tags
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

    // Author
    author: { type: String, default: 'Admin' },

    // Publishing
    status: { type: String, enum: ['draft', 'published', 'private', 'trash', 'scheduled'], default: 'draft' },
    visibility: { type: String, enum: ['public', 'private', 'password'], default: 'public' },
    password: { type: String, default: '' },
    publishDate: { type: Date, default: Date.now },
    scheduledDate: { type: Date },

    // Media formatting
    mediaSize: { type: String, enum: ['small', 'medium', 'large', 'full'], default: 'medium' },
    textAlignment: { type: String, enum: ['left', 'center', 'right', 'justify'], default: 'left' },
    fontSize: { type: String, enum: ['small', 'medium', 'large', 'xl'], default: 'medium' },
    fontColor: { type: String, default: '#000000' },

    // Styling
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },

    // Layout & Links
    layoutSettings: { type: String, enum: ['left-right', 'right-left', 'center', 'full-width', 'grid'], default: 'left-right' },
    links: [{
        url: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, enum: ['internal', 'external', 'download'], default: 'external' },
        openInNewTab: { type: Boolean, default: true }
    }],

    // Social embeds
    socialEmbeds: [{
        platform: { type: String, enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'facebook', 'linkedin', 'vimeo'], required: true },
        url: { type: String, required: true },
        embedCode: String,
        mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
    }],

    // SEO
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String }],
    metaImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },

    // Engagement
    allowComments: { type: Boolean, default: true },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },

    // Advanced
    template: { type: String, enum: ['standard', 'gallery', 'video', 'audio', 'quote', 'link', 'aside'], default: 'standard' },
    customFields: [{ key: String, value: String, type: { type: String, enum: ['text', 'number', 'date', 'boolean', 'url'], default: 'text' } }],

    // Revisions
    revisions: [{ content: String, title: String, author: String, createdAt: { type: Date, default: Date.now }, note: String }],

    // Reading time
    readingTime: { type: Number, default: 0 },

    // Flags
    isFeatured: { type: Boolean, default: false },
    isSticky: { type: Boolean, default: false },

    // Analytics
    analytics: {
        avgTimeOnPage: Number,
        bounceRate: Number,
        topReferrers: [String],
        searchTerms: [String]
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Indexes
postSchema.index({ status: 1, publishDate: -1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ categories: 1, status: 1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ slug: 1 });
postSchema.index({ isFeatured: 1, status: 1 });

// Virtuals
postSchema.virtual('estimatedReadingTime').get(function () {
    if (this.readingTime) return this.readingTime;
    const wordsPerMinute = 200;
    const wordCount = this.content ? this.content.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
});

postSchema.virtual('autoExcerpt').get(function () {
    if (this.excerpt) return this.excerpt;
    if (this.content) {
        const plainText = this.content.replace(/<[^>]*>/g, '');
        return plainText.length > 155 ? plainText.substring(0, 155) + '...' : plainText;
    }
    return '';
});

// Pre-save (unique slug + reading time)
postSchema.pre('save', async function (next) {
    // Generate slug if missing
    if (!this.slug && this.title) {
        let baseSlug = slugify(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        // Ensure slug is unique
        while (await mongoose.models.Post.findOne({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        this.slug = slug;
    }

    // Update reading time
    if (this.content) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }
    next();
});

// Post-save (update counts & media usage)
postSchema.post('save', async function () {
    const Category = mongoose.model('Category');
    const Tag = mongoose.model('Tag');

    // Category counts
    for (let categoryId of this.categories) {
        const count = await this.constructor.countDocuments({ categories: categoryId, status: 'published' });
        await Category.findByIdAndUpdate(categoryId, { count });
    }

    // Tag counts
    for (let tagId of this.tags) {
        const count = await this.constructor.countDocuments({ tags: tagId, status: 'published' });
        await Tag.findByIdAndUpdate(tagId, { count });
    }

    // Media counts
    if (this.featuredImage?.media) {
        await Media.findByIdAndUpdate(this.featuredImage.media, { $inc: { usageCount: 1 }, lastUsed: new Date() });
    }

    for (let mediaItem of this.mediaItems) {
        if (mediaItem.media) {
            await Media.findByIdAndUpdate(mediaItem.media, { $inc: { usageCount: 1 }, lastUsed: new Date() });
        }
    }

    for (let embed of this.socialEmbeds) {
        if (embed.mediaId) {
            await Media.findByIdAndUpdate(embed.mediaId, { $inc: { usageCount: 1 }, lastUsed: new Date() });
        }
    }
});

// Static: get posts with media
postSchema.statics.getWithMedia = function (query = {}, options = {}) {
    return this.find(query)
        .populate({ path: 'featuredImage.media', model: 'Media' })
        .populate({ path: 'mediaItems.media', model: 'Media' })
        .populate({ path: 'socialEmbeds.mediaId', model: 'Media' })
        .populate('categories', 'name slug')
        .populate('tags', 'name slug')
        .sort(options.sort || { updatedAt: -1 })
        .limit(options.limit || 10)
        .skip(options.skip || 0);
};

// Methods
postSchema.methods.addMedia = function (mediaId, role = 'attachment', options = {}) {
    const mediaItem = { media: mediaId, role, order: this.mediaItems.length, caption: options.caption || '', alt: options.alt || '' };
    this.mediaItems.push(mediaItem);
    return this.save();
};

postSchema.methods.removeMedia = function (mediaId) {
    this.mediaItems = this.mediaItems.filter(item => !item.media.equals(mediaId));
    return this.save();
};

postSchema.methods.addSocialEmbed = function (platform, url, embedCode = '', mediaId = null) {
    this.socialEmbeds.push({ platform, url, embedCode, mediaId });
    return this.save();
};

postSchema.methods.createRevision = function (note = '') {
    this.revisions.push({ content: this.content, title: this.title, author: this.author, note });
    if (this.revisions.length > 10) this.revisions = this.revisions.slice(-10);
    return this.save();
};

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
module.exports = Post;
