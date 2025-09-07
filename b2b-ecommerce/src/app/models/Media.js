// models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video', 'audio', 'document', 'embed'],
        required: true
    },
    // For embedded content (YouTube, Instagram, etc.)
    embedData: {
        platform: {
            type: String,
            enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'vimeo', 'direct']
        },
        embedUrl: String,
        embedHtml: String,
        thumbnail: String,
        title: String,
        description: String
    },
    // Image/video specific metadata
    metadata: {
        width: Number,
        height: Number,
        duration: Number, // for videos/audio
        aspectRatio: String,
        colorPalette: [String], // dominant colors for images
        quality: String // low, medium, high
    },
    // SEO and accessibility
    alt: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    // Organization
    tags: [{
        type: String,
        trim: true
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // Usage tracking
    usageCount: {
        type: Number,
        default: 0
    },
    lastUsed: {
        type: Date
    },
    // Upload info
    uploadedBy: {
        type: String,
        default: 'Admin'
    },
    // Storage info
    storage: {
        provider: {
            type: String,
            enum: ['local', 'aws-s3', 'cloudinary', 'google-cloud'],
            default: 'local'
        },
        bucket: String,
        key: String,
        cdn: Boolean,
        cdnUrl: String
    },
    // Processing status for large files
    processing: {
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'completed'
        },
        progress: {
            type: Number,
            default: 100
        },
        error: String
    },
    // Variants (thumbnails, different sizes)
    variants: [{
        size: {
            type: String,
            enum: ['thumbnail', 'small', 'medium', 'large', 'original']
        },
        url: String,
        width: Number,
        height: Number,
        fileSize: Number
    }],
    // Security
    isPublic: {
        type: Boolean,
        default: true
    },
    requiresAuth: {
        type: Boolean,
        default: false
    },
    // Soft delete
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
mediaSchema.index({ type: 1, deleted: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ 'embedData.platform': 1 });

// Virtual for file size in human readable format
mediaSchema.virtual('fileSizeFormatted').get(function () {
    const bytes = this.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for media type icon
mediaSchema.virtual('typeIcon').get(function () {
    switch (this.type) {
        case 'image': return 'image';
        case 'video': return 'video_library';
        case 'audio': return 'audiotrack';
        case 'document': return 'description';
        case 'embed': return 'link';
        default: return 'attachment';
    }
});

// Auto-set type based on mimetype
mediaSchema.pre('save', function (next) {
    if (!this.type && this.mimetype) {
        if (this.mimetype.startsWith('image/')) {
            this.type = 'image';
        } else if (this.mimetype.startsWith('video/')) {
            this.type = 'video';
        } else if (this.mimetype.startsWith('audio/')) {
            this.type = 'audio';
        } else {
            this.type = 'document';
        }
    }
    next();
});

// Update usage count when accessed
mediaSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    this.lastUsed = new Date();
    return this.save();
};

// Static method to get media by type
mediaSchema.statics.getByType = function (type, options = {}) {
    const query = { type, deleted: false };
    return this.find(query)
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 50)
        .skip(options.skip || 0);
};

// Static method for search
mediaSchema.statics.search = function (searchTerm, options = {}) {
    const query = {
        deleted: false,
        $or: [
            { originalName: { $regex: searchTerm, $options: 'i' } },
            { alt: { $regex: searchTerm, $options: 'i' } },
            { caption: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    if (options.type) {
        query.type = options.type;
    }

    return this.find(query)
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 50)
        .skip(options.skip || 0);
};

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
module.exports = Media;