import mongoose, { Schema } from 'mongoose';

// Media (images/videos) for product or variants
const MediaSchema = new Schema({
  url: { type: String, required: true },
  alt: String,
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  width: Number,
  height: Number,
  duration: Number, // For videos in seconds
}, { _id: false });

// Key/value specification rows
const SpecSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

// Variant option definition (e.g., Color -> [Black, Silver])
const VariantOptionSchema = new Schema({
  name: { type: String, required: true },
  values: [{ type: String, required: true }],
}, { _id: false });

// A variant SKU for an option combination
const VariantSkuSchema = new Schema({
  sku: { type: String, required: true, unique: true },
  attributes: { type: Map, of: String },
  price: {
    mrp: Number,
    sale: Number,
    currency: { type: String, default: 'USD' },
  },
  stock: {
    track: { type: Boolean, default: true },
    qty: { type: Number, default: 0 },
  },
  media: [MediaSchema],
  barcode: String,
  gtin: String,
  weight: Number,
  dimensions: { l: Number, w: Number, h: Number },
}, { _id: false });

// Quantity-based discount tiers for B2B (no cart -> used for display/quotes)
const QuantityDiscountSchema = new Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number },
  discountType: { type: String, enum: ['percent', 'amount'], default: 'percent' },
  discountValue: { type: Number, required: true },
  note: String,
}, { _id: false });

// Individual review/feedback schema
const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: { type: String, maxlength: 100 },
  comment: { type: String, maxlength: 1000 },
  images: [String], // URLs to review images
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, // Admin moderation
  helpfulCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
  adminResponse: {
    message: String,
    respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date
  }
}, { timestamps: true });

// Search analytics schema for tracking user searches
const SearchAnalyticsSchema = new Schema({
  searchTerm: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userIP: String,
  location: {
    country: String,
    city: String
  },
  resultCount: Number,
  clickedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  source: { type: String, enum: ['web', 'mobile', 'api'], default: 'web' }
}, { timestamps: true });

// Product view tracking
const ViewTrackingSchema = new Schema({
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userIP: String,
  source: { type: String, enum: ['search', 'category', 'recommendation', 'direct'], default: 'direct' },
  referrer: String
}, { _id: false });

const ProductSchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, index: true, maxlength: 100 },
  brand: { type: String, required: true, maxlength: 100 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
  tags: [{ type: String, maxlength: 50 }],

  // Content
  highlights: [{ type: String, maxlength: 200 }],
  descriptionHtml: { type: String, required: true },
  specs: { type: [SpecSchema], required: true },
  inTheBox: [{ type: String, maxlength: 100 }],

  // Pricing
  price: {
    mrp: { type: Number, required: true, min: 0 },
    sale: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
  },

  // Inventory
  inventory: {
    track: { type: Boolean, default: true },
    qty: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
  },

  // Media
  media: { type: [MediaSchema], required: true },
  videoUrls: [{ type: String }],

  // Variants
  options: [VariantOptionSchema],
  variants: [VariantSkuSchema],

  // Rating & Reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  reviews: [ReviewSchema],

  // Shipping
  shipping: {
    weight: { type: Number, min: 0 },
    dimensions: { l: Number, w: Number, h: Number },
    originCountry: String,
    leadTimeDays: { type: Number, min: 0 },
    freeShipping: { type: Boolean, default: false },
  },

  // B2B Features
  quantityDiscounts: [QuantityDiscountSchema],
  contactOnly: { type: Boolean, default: true },

  // Analytics & Search Optimization
  searchCount: { type: Number, default: 0, min: 0 }, // Total times this product appeared in searches
  clickCount: { type: Number, default: 0, min: 0 }, // Times product was clicked
  viewCount: { type: Number, default: 0, min: 0 }, // Total product page views
  views: [ViewTrackingSchema], // Detailed view tracking (keep last 30 days)

  // Search Keywords (for better search results)
  searchKeywords: [String], // Auto-generated from title, brand, category, tags

  // Trending score (calculated field)
  trendingScore: { type: Number, default: 0 }, // Calculated based on recent views, searches, clicks

  // Performance Metrics (updated daily via cron job)
  metrics: {
    last7Days: {
      views: { type: Number, default: 0 },
      searches: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    },
    last30Days: {
      views: { type: Number, default: 0 },
      searches: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    }
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: { type: String, maxlength: 160 },
    canonicalUrl: String,
    ogImage: String,
  },

  // Status
  status: {
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isDiscontinued: { type: Boolean, default: false },
  },

  // Custom fields for flexibility
  customFields: { type: Map, of: String },

  // Admin tracking
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  // Moderation
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,

}, {
  timestamps: true,
  collection: 'products',
  // Compound indexes for better query performance
  index: [
    { searchCount: -1, viewCount: -1 }, // For trending products
    { trendingScore: -1 },
    { 'status.isPublished': 1, 'status.isFeatured': 1 },
    { category: 1, 'status.isPublished': 1 },
    { searchKeywords: 1 },
    { createdAt: -1 }
  ]
});

// Pre-save middleware to update search keywords
ProductSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isModified('brand') || this.isModified('tags')) {
    const keywords = [];

    // Add title words
    if (this.title) {
      keywords.push(...this.title.toLowerCase().split(/\s+/));
    }

    // Add brand
    if (this.brand) {
      keywords.push(this.brand.toLowerCase());
    }

    // Add tags
    if (this.tags && this.tags.length > 0) {
      keywords.push(...this.tags.map(tag => tag.toLowerCase()));
    }

    // Remove duplicates and empty strings
    this.searchKeywords = [...new Set(keywords.filter(keyword => keyword.length > 0))];
  }
  next();
});

// Method to calculate trending score
ProductSchema.methods.calculateTrendingScore = function () {
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate recent activity
  const recentViews = this.views.filter(view => view.date >= last7Days).length;
  const monthlyViews = this.views.filter(view => view.date >= last30Days).length;

  // Weight recent activity more heavily
  const recentWeight = 0.7;
  const monthlyWeight = 0.3;

  this.trendingScore = (recentViews * recentWeight) + (monthlyViews * monthlyWeight);
  return this.trendingScore;
};

// Method to add a view
ProductSchema.methods.addView = function (userId, userIP, source = 'direct', referrer = '') {
  this.viewCount = (this.viewCount || 0) + 1;

  // Add to detailed tracking (keep only last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  this.views = this.views.filter(view => view.date >= thirtyDaysAgo);

  this.views.push({
    date: new Date(),
    userId,
    userIP,
    source,
    referrer
  });

  // Recalculate trending score
  this.calculateTrendingScore();
};

// Method to increment search count
ProductSchema.methods.incrementSearchCount = function () {
  this.searchCount = (this.searchCount || 0) + 1;
  this.calculateTrendingScore();
};

// Method to add a review
ProductSchema.methods.addReview = function (reviewData) {
  this.reviews.push(reviewData);

  // Update rating statistics
  const approvedReviews = this.reviews.filter(review => review.isApproved);
  const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);

  this.rating.count = approvedReviews.length;
  this.rating.average = this.rating.count > 0 ? totalRating / this.rating.count : 0;

  // Update rating breakdown
  this.rating.breakdown = {
    five: approvedReviews.filter(r => r.rating === 5).length,
    four: approvedReviews.filter(r => r.rating === 4).length,
    three: approvedReviews.filter(r => r.rating === 3).length,
    two: approvedReviews.filter(r => r.rating === 2).length,
    one: approvedReviews.filter(r => r.rating === 1).length
  };
};

// Static method to get trending products
ProductSchema.statics.getTrendingProducts = function (limit = 10) {
  return this.find({ 'status.isPublished': true })
    .sort({ trendingScore: -1, viewCount: -1, searchCount: -1 })
    .limit(limit);
};

// Static method to get most searched products
ProductSchema.statics.getMostSearchedProducts = function (limit = 10) {
  return this.find({ 'status.isPublished': true })
    .sort({ searchCount: -1, clickCount: -1 })
    .limit(limit);
};

// Create separate model for search analytics
const SearchAnalytics = mongoose.models.SearchAnalytics || mongoose.model('SearchAnalytics', SearchAnalyticsSchema);

export { SearchAnalytics };
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);