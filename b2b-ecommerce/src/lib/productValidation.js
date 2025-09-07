// /lib/productValidation.js - Comprehensive product validation
export const validateProductData = (data, isUpdate = false) => {
    const errors = {};

    // Title validation
    if (!isUpdate || data.title !== undefined) {
        if (!data.title || typeof data.title !== 'string') {
            errors.title = 'Title is required';
        } else if (data.title.trim().length < 3) {
            errors.title = 'Title must be at least 3 characters long';
        } else if (data.title.length > 200) {
            errors.title = 'Title must be less than 200 characters';
        }
    }

    // Slug validation
    if (!isUpdate || data.slug !== undefined) {
        if (!data.slug || typeof data.slug !== 'string') {
            errors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
            errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        } else if (data.slug.length > 100) {
            errors.slug = 'Slug must be less than 100 characters';
        } else if (data.slug.startsWith('-') || data.slug.endsWith('-')) {
            errors.slug = 'Slug cannot start or end with a hyphen';
        }
    }

    // Brand validation
    if (!isUpdate || data.brand !== undefined) {
        if (!data.brand || typeof data.brand !== 'string') {
            errors.brand = 'Brand is required';
        } else if (data.brand.trim().length < 2) {
            errors.brand = 'Brand must be at least 2 characters long';
        } else if (data.brand.length > 100) {
            errors.brand = 'Brand must be less than 100 characters';
        }
    }

    // Category validation
    if (!isUpdate || data.category !== undefined) {
        if (!data.category) {
            errors.category = 'Category is required';
        }
    }

    // Price validation
    if (data.price) {
        if (!data.price.mrp || typeof data.price.mrp !== 'number' || data.price.mrp <= 0) {
            errors['price.mrp'] = 'MRP must be a positive number';
        }

        if (data.price.sale !== undefined && data.price.sale !== null) {
            if (typeof data.price.sale !== 'number' || data.price.sale <= 0) {
                errors['price.sale'] = 'Sale price must be a positive number';
            } else if (data.price.mrp && data.price.sale > data.price.mrp) {
                errors['price.sale'] = 'Sale price cannot be higher than MRP';
            }
        }

        if (data.price.currency && typeof data.price.currency !== 'string') {
            errors['price.currency'] = 'Currency must be a valid string';
        }
    }

    // Description validation
    if (!isUpdate || data.descriptionHtml !== undefined) {
        if (!data.descriptionHtml || typeof data.descriptionHtml !== 'string') {
            errors.descriptionHtml = 'Description is required';
        } else if (data.descriptionHtml.trim().length < 50) {
            errors.descriptionHtml = 'Description must be at least 50 characters long';
        } else if (data.descriptionHtml.length > 10000) {
            errors.descriptionHtml = 'Description is too long (max 10,000 characters)';
        }
    }

    // Highlights validation
    if (!isUpdate || data.highlights !== undefined) {
        if (!Array.isArray(data.highlights)) {
            errors.highlights = 'Highlights must be an array';
        } else if (!data.highlights.some(h => h && h.trim())) {
            errors.highlights = 'At least one highlight is required';
        } else {
            data.highlights.forEach((highlight, index) => {
                if (highlight && highlight.length > 200) {
                    errors[`highlights.${index}`] = 'Highlight is too long (max 200 characters)';
                }
            });
        }
    }

    // Media validation
    if (!isUpdate || data.media !== undefined) {
        if (!Array.isArray(data.media)) {
            errors.media = 'Media must be an array';
        } else if (!data.media.some(m => m && m.url)) {
            errors.media = 'At least one media item with URL is required';
        } else {
            data.media.forEach((mediaItem, index) => {
                if (mediaItem.url) {
                    try {
                        new URL(mediaItem.url);
                    } catch {
                        errors[`media.${index}.url`] = 'Invalid URL format';
                    }
                }

                if (mediaItem.type && !['image', 'video'].includes(mediaItem.type)) {
                    errors[`media.${index}.type`] = 'Media type must be either "image" or "video"';
                }

                if (mediaItem.sortOrder !== undefined && (typeof mediaItem.sortOrder !== 'number' || mediaItem.sortOrder < 0)) {
                    errors[`media.${index}.sortOrder`] = 'Sort order must be a non-negative number';
                }
            });
        }
    }

    // Specs validation
    if (!isUpdate || data.specs !== undefined) {
        if (!Array.isArray(data.specs)) {
            errors.specs = 'Specifications must be an array';
        } else if (!data.specs.some(s => s && s.key && s.value)) {
            errors.specs = 'At least one specification is required';
        } else {
            data.specs.forEach((spec, index) => {
                if (spec.key && spec.key.length > 100) {
                    errors[`specs.${index}.key`] = 'Specification key is too long (max 100 characters)';
                }
                if (spec.value && spec.value.length > 500) {
                    errors[`specs.${index}.value`] = 'Specification value is too long (max 500 characters)';
                }
            });
        }
    }

    // Inventory validation
    if (data.inventory) {
        if (data.inventory.track && (typeof data.inventory.qty !== 'number' || data.inventory.qty < 0)) {
            errors['inventory.qty'] = 'Quantity must be a non-negative number when tracking inventory';
        }

        if (data.inventory.lowStockThreshold !== undefined && (typeof data.inventory.lowStockThreshold !== 'number' || data.inventory.lowStockThreshold < 0)) {
            errors['inventory.lowStockThreshold'] = 'Low stock threshold must be a non-negative number';
        }
    }

    // Video URLs validation
    if (data.videoUrls && Array.isArray(data.videoUrls)) {
        data.videoUrls.forEach((url, index) => {
            if (url) {
                try {
                    new URL(url);
                } catch {
                    errors[`videoUrls.${index}`] = 'Invalid video URL format';
                }
            }
        });
    }

    // Tags validation
    if (data.tags && Array.isArray(data.tags)) {
        if (data.tags.length > 20) {
            errors.tags = 'Too many tags (max 20)';
        }
        data.tags.forEach((tag, index) => {
            if (tag && tag.length > 50) {
                errors[`tags.${index}`] = 'Tag is too long (max 50 characters)';
            }
        });
    }

    // Shipping validation
    if (data.shipping) {
        if (data.shipping.weight !== undefined && (typeof data.shipping.weight !== 'number' || data.shipping.weight < 0)) {
            errors['shipping.weight'] = 'Weight must be a non-negative number';
        }

        if (data.shipping.leadTimeDays !== undefined && (typeof data.shipping.leadTimeDays !== 'number' || data.shipping.leadTimeDays < 0)) {
            errors['shipping.leadTimeDays'] = 'Lead time must be a non-negative number';
        }

        if (data.shipping.dimensions) {
            ['l', 'w', 'h'].forEach(dim => {
                if (data.shipping.dimensions[dim] !== undefined && (typeof data.shipping.dimensions[dim] !== 'number' || data.shipping.dimensions[dim] < 0)) {
                    errors[`shipping.dimensions.${dim}`] = 'Dimension must be a non-negative number';
                }
            });
        }
    }

    // SEO validation
    if (data.seo) {
        if (data.seo.metaTitle && data.seo.metaTitle.length > 60) {
            errors['seo.metaTitle'] = 'Meta title is too long (max 60 characters)';
        }

        if (data.seo.metaDescription && data.seo.metaDescription.length > 160) {
            errors['seo.metaDescription'] = 'Meta description is too long (max 160 characters)';
        }

        if (data.seo.canonicalUrl) {
            try {
                new URL(data.seo.canonicalUrl);
            } catch {
                errors['seo.canonicalUrl'] = 'Invalid canonical URL format';
            }
        }

        if (data.seo.ogImage) {
            try {
                new URL(data.seo.ogImage);
            } catch {
                errors['seo.ogImage'] = 'Invalid OG image URL format';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// /lib/productAnalytics.js - Analytics utilities
export class ProductAnalytics {
    static async updateDailyMetrics() {
        try {
            const Product = require('@/models/Product').default;
            await Product.connect();

            const now = new Date();
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Get all published products
            const products = await Product.find({ 'status.isPublished': true });

            for (const product of products) {
                // Calculate metrics for last 7 days
                const last7DaysViews = product.views.filter(view => view.date >= last7Days);
                const last30DaysViews = product.views.filter(view => view.date >= last30Days);

                // Update metrics (you might want to get search data from SearchAnalytics model)
                product.metrics = {
                    last7Days: {
                        views: last7DaysViews.length,
                        searches: 0, // Would need to query SearchAnalytics
                        clicks: 0 // Would need to track clicks separately
                    },
                    last30Days: {
                        views: last30DaysViews.length,
                        searches: 0,
                        clicks: 0
                    }
                };

                // Update trending score
                product.calculateTrendingScore();

                // Clean old view data (keep only last 30 days)
                product.views = last30DaysViews;

                await product.save();
            }

            console.log(`Updated metrics for ${products.length} products`);
            return { success: true, updatedCount: products.length };

        } catch (error) {
            console.error('Error updating daily metrics:', error);
            return { success: false, error: error.message };
        }
    }

    static async getSearchAnalytics(days = 30) {
        try {
            const SearchAnalytics = require('@/models/Product').SearchAnalytics;
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const analytics = await SearchAnalytics.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: '$searchTerm',
                        count: { $sum: 1 },
                        totalResults: { $avg: '$resultCount' },
                        uniqueUsers: { $addToSet: '$userId' }
                    }
                },
                {
                    $project: {
                        searchTerm: '$_id',
                        count: 1,
                        averageResults: { $round: ['$totalResults', 0] },
                        uniqueUserCount: { $size: '$uniqueUsers' }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 50 }
            ]);

            return analytics;
        } catch (error) {
            console.error('Error getting search analytics:', error);
            return [];
        }
    }

    static async getTopPerformingProducts(metric = 'views', days = 7, limit = 20) {
        try {
            const Product = require('@/models/Product').default;

            let sortField;
            switch (metric) {
                case 'views':
                    sortField = days <= 7 ? 'metrics.last7Days.views' : 'metrics.last30Days.views';
                    break;
                case 'searches':
                    sortField = days <= 7 ? 'metrics.last7Days.searches' : 'metrics.last30Days.searches';
                    break;
                case 'trending':
                    sortField = 'trendingScore';
                    break;
                case 'rating':
                    sortField = 'rating.average';
                    break;
                default:
                    sortField = 'viewCount';
            }

            const products = await Product.find({ 'status.isPublished': true })
                .sort({ [sortField]: -1 })
                .limit(limit)
                .select('title slug brand viewCount searchCount rating metrics')
                .populate('category', 'name');

            return products;
        } catch (error) {
            console.error('Error getting top performing products:', error);
            return [];
        }
    }

    static async cleanupOldData(daysToKeep = 90) {
        try {
            const SearchAnalytics = require('@/models/Product').SearchAnalytics;
            const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

            const result = await SearchAnalytics.deleteMany({
                createdAt: { $lt: cutoffDate }
            });

            console.log(`Cleaned up ${result.deletedCount} old search analytics records`);
            return result;
        } catch (error) {
            console.error('Error cleaning up old data:', error);
            return { deletedCount: 0 };
        }
    }
}

// /lib/cron/updateMetrics.js - Daily cron job
export async function updateMetricsCron() {
    try {
        console.log('Starting daily metrics update...');

        const result = await ProductAnalytics.updateDailyMetrics();

        if (result.success) {
            console.log(`✅ Daily metrics updated successfully for ${result.updatedCount} products`);
        } else {
            console.error('❌ Failed to update daily metrics:', result.error);
        }

        // Also cleanup old data
        await ProductAnalytics.cleanupOldData(90);

    } catch (error) {
        console.error('❌ Error in metrics cron job:', error);
    }
}

// Usage example for Next.js API route: /api/cron/update-metrics
/*
import { updateMetricsCron } from '@/lib/cron/updateMetrics';

export async function GET(request) {
  // Verify cron secret or authentication
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  await updateMetricsCron();
  return new Response('Metrics updated successfully', { status: 200 });
}
*/

// /lib/productHelpers.js - Additional helper functions
export class ProductHelpers {
    static generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    static async ensureUniqueSlug(baseSlug, excludeId = null) {
        const Product = require('@/models/Product').default;
        let slug = baseSlug;
        let counter = 1;

        while (true) {
            const query = { slug };
            if (excludeId) {
                query._id = { $ne: excludeId };
            }

            const existingProduct = await Product.findOne(query);
            if (!existingProduct) {
                return slug;
            }

            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    static calculateDiscountPercentage(mrp, salePrice) {
        if (!mrp || !salePrice || salePrice >= mrp) {
            return 0;
        }
        return Math.round(((mrp - salePrice) / mrp) * 100);
    }

    static formatPrice(price, currency = 'USD') {
        const formatters = {
            USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
            PKR: new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }),
            EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
        };

        return formatters[currency]?.format(price) || `${currency} ${price}`;
    }

    static getStockStatus(inventory) {
        if (!inventory.track) {
            return 'in_stock';
        }

        if (inventory.qty <= 0) {
            return 'out_of_stock';
        }

        if (inventory.qty <= inventory.lowStockThreshold) {
            return 'low_stock';
        }

        return 'in_stock';
    }

    static sanitizeSearchTerm(searchTerm) {
        return searchTerm
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ');
    }

    static buildSearchQuery(searchTerm, filters = {}) {
        const query = { 'status.isPublished': true };

        if (searchTerm) {
            const sanitizedTerm = this.sanitizeSearchTerm(searchTerm);
            const searchWords = sanitizedTerm.split(' ').filter(word => word.length > 0);

            if (searchWords.length > 0) {
                query.$or = [
                    { title: { $regex: searchWords.join('|'), $options: 'i' } },
                    { brand: { $regex: searchWords.join('|'), $options: 'i' } },
                    { tags: { $in: searchWords.map(word => new RegExp(word, 'i')) } },
                    { searchKeywords: { $in: searchWords.map(word => new RegExp(word, 'i')) } }
                ];
            }
        }

        // Apply filters
        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.brand) {
            query.brand = { $regex: filters.brand, $options: 'i' };
        }

        if (filters.minPrice || filters.maxPrice) {
            query['price.sale'] = {};
            if (filters.minPrice) {
                query['price.sale'].$gte = parseFloat(filters.minPrice);
            }
            if (filters.maxPrice) {
                query['price.sale'].$lte = parseFloat(filters.maxPrice);
            }
        }

        if (filters.inStock) {
            query.$or = [
                { 'inventory.track': false },
                { 'inventory.track': true, 'inventory.qty': { $gt: 0 } }
            ];
        }

        if (filters.minRating) {
            query['rating.average'] = { $gte: parseFloat(filters.minRating) };
        }

        return query;
    }

    static buildSortOptions(sortBy, order = 'desc') {
        const sortOptions = {};

        switch (sortBy) {
            case 'trending':
                sortOptions.trendingScore = -1;
                sortOptions.viewCount = -1;
                break;
            case 'popularity':
                sortOptions.searchCount = -1;
                sortOptions.viewCount = -1;
                break;
            case 'rating':
                sortOptions['rating.average'] = order === 'desc' ? -1 : 1;
                sortOptions['rating.count'] = -1;
                break;
            case 'price':
                sortOptions['price.sale'] = order === 'desc' ? -1 : 1;
                sortOptions['price.mrp'] = order === 'desc' ? -1 : 1;
                break;
            case 'name':
                sortOptions.title = order === 'desc' ? -1 : 1;
                break;
            case 'newest':
                sortOptions.createdAt = -1;
                break;
            case 'oldest':
                sortOptions.createdAt = 1;
                break;
            default:
                sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        return sortOptions;
    }
}

// /lib/reviewHelpers.js - Review-specific helpers
export class ReviewHelpers {
    static validateReviewData(data) {
        const errors = {};

        if (!data.rating || data.rating < 1 || data.rating > 5) {
            errors.rating = 'Rating must be between 1 and 5';
        }

        if (!data.userName || data.userName.trim().length < 2) {
            errors.userName = 'Name must be at least 2 characters long';
        }

        if (!data.comment || data.comment.trim().length < 10) {
            errors.comment = 'Comment must be at least 10 characters long';
        } else if (data.comment.length > 1000) {
            errors.comment = 'Comment is too long (max 1000 characters)';
        }

        if (data.title && data.title.length > 100) {
            errors.title = 'Title is too long (max 100 characters)';
        }

        if (data.userEmail && !this.isValidEmail(data.userEmail)) {
            errors.userEmail = 'Invalid email format';
        }

        if (data.images && Array.isArray(data.images)) {
            if (data.images.length > 5) {
                errors.images = 'Too many images (max 5)';
            }

            data.images.forEach((url, index) => {
                if (url) {
                    try {
                        new URL(url);
                    } catch {
                        errors[`images.${index}`] = 'Invalid image URL format';
                    }
                }
            });
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static filterProfanity(text) {
        // Basic profanity filter - you might want to use a more sophisticated library
        const profanityWords = ['badword1', 'badword2']; // Add actual profanity words
        let filteredText = text;

        profanityWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filteredText = filteredText.replace(regex, '*'.repeat(word.length));
        });

        return filteredText;
    }

    static calculateHelpfulnessScore(helpful, total) {
        if (total === 0) return 0;
        return (helpful / total) * 100;
    }

    static getReviewSummary(reviews) {
        const approved = reviews.filter(r => r.isApproved);
        const total = approved.length;

        if (total === 0) {
            return {
                average: 0,
                count: 0,
                breakdown: { five: 0, four: 0, three: 0, two: 0, one: 0 }
            };
        }

        const sum = approved.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;

        const breakdown = {
            five: approved.filter(r => r.rating === 5).length,
            four: approved.filter(r => r.rating === 4).length,
            three: approved.filter(r => r.rating === 3).length,
            two: approved.filter(r => r.rating === 2).length,
            one: approved.filter(r => r.rating === 1).length
        };

        return {
            average: Math.round(average * 10) / 10, // Round to 1 decimal place
            count: total,
            breakdown
        };
    }
}

// /lib/constants.js - Application constants
export const PRODUCT_CONSTANTS = {
    VALIDATION: {
        TITLE_MIN_LENGTH: 3,
        TITLE_MAX_LENGTH: 200,
        SLUG_MAX_LENGTH: 100,
        BRAND_MIN_LENGTH: 2,
        BRAND_MAX_LENGTH: 100,
        DESCRIPTION_MIN_LENGTH: 50,
        DESCRIPTION_MAX_LENGTH: 10000,
        HIGHLIGHT_MAX_LENGTH: 200,
        SPEC_KEY_MAX_LENGTH: 100,
        SPEC_VALUE_MAX_LENGTH: 500,
        TAG_MAX_LENGTH: 50,
        MAX_TAGS: 20,
        MAX_MEDIA_ITEMS: 10,
        MAX_VIDEO_URLS: 5,
        MAX_HIGHLIGHTS: 10,
        MAX_SPECS: 20
    },

    SEO: {
        META_TITLE_MAX_LENGTH: 60,
        META_DESCRIPTION_MAX_LENGTH: 160
    },

    REVIEWS: {
        COMMENT_MIN_LENGTH: 10,
        COMMENT_MAX_LENGTH: 1000,
        TITLE_MAX_LENGTH: 100,
        MAX_IMAGES: 5
    },

    ANALYTICS: {
        VIEW_TRACKING_DAYS: 30,
        SEARCH_ANALYTICS_RETENTION_DAYS: 90,
        METRICS_UPDATE_INTERVAL: '0 2 * * *', // Daily at 2 AM
        TRENDING_CALCULATION_DAYS: 7
    },

    SORT_OPTIONS: [
        { value: 'trending', label: 'Trending' },
        { value: 'popularity', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'price', label: 'Price: Low to High' },
        { value: 'newest', label: 'Newest First' },
        { value: 'name', label: 'Name: A to Z' }
    ],

    CURRENCIES: [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
        { code: 'EUR', symbol: '€', name: 'Euro' }
    ]
};

export default {
    validateProductData,
    ProductAnalytics,
    ProductHelpers,
    ReviewHelpers,
    PRODUCT_CONSTANTS
};