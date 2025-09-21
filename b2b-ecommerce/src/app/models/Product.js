// src/app/models/Product.js
import mongoose, { Schema } from 'mongoose';

/**
 * Media for images, videos, or embeds (YouTube/TikTok URLs, etc.)
 */
const MediaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video', 'embed'],
      required: true,
      default: 'image'
    },
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    duration: Number, // seconds for video
    embedType: {
      type: String,
      enum: ['youtube', 'tiktok', 'vimeo', 'instagram'],
      required: function () {
        return this.type === 'embed';
      }
    }
  },
  { _id: true }
);

/**
 * Spec key/value row (e.g. Material: Stainless Steel)
 */
const SpecSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

/**
 * Quantity discount tier for B2B
 * Example: minQty=10, maxQty=49, discountType='percent', discountValue=5
 * means 5% off for quantities 10-49
 */
const QuantityDiscountSchema = new Schema(
  {
    minQty: { type: Number, required: true, min: 1 },
    maxQty: { type: Number }, // optional open-ended tier
    discountType: {
      type: String,
      enum: ['percent', 'flat'],
      default: 'percent'
    },
    discountValue: { type: Number, required: true, min: 0.01 },
    note: { type: String, maxlength: 120 }
  },
  { _id: false }
);

/**
 * Main Product Schema - Enhanced for B2B eCommerce
 */
const ProductSchema = new Schema(
  {
    // Basic Information
    title: { type: String, required: true, maxlength: 200, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 100,
      lowercase: true,
      trim: true
    },
    sku: { type: String, unique: true, sparse: true, trim: true },
    brand: { type: String, trim: true },

    // Content
    description: { type: String, required: true }, // rich HTML from Quill
    shortDescription: { type: String, maxlength: 500 },
    features: [{ type: String, maxlength: 200 }],
    specifications: [SpecSchema],

    // Media Gallery
    media: {
      type: [MediaSchema],
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'At least one media item is required'
      }
    },
    videoUrls: [String], // external videos if any

    // Pricing
    price: { type: Number, required: true, min: 0 },
    salePrice: {
      type: Number,
      min: 0,
      validate: {
        validator(val) {
          return !val || val < this.price;
        },
        message: 'Sale price must be less than regular price'
      }
    },
    currency: { type: String, default: 'USD' },

    // Inventory Management
    stock: { type: Number, default: 0, min: 0 },
    manageStock: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 5, min: 0 },

    // Categorization
    categories: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],

    // Visibility & Status
    visibility: {
      type: String,
      enum: ['visible', 'hidden', 'draft'],
      default: 'draft'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active'
    },
    featured: { type: Boolean, default: false },

    // B2B Quantity Discounts - NEW FEATURE
    /**
     * Example tiers:
     * [
     *   { minQty: 10, maxQty: 49, discountType: 'percent', discountValue: 5, note: 'Small bulk order' },
     *   { minQty: 50, maxQty: 99, discountType: 'percent', discountValue: 10, note: 'Medium bulk order' },
     *   { minQty: 100, discountType: 'percent', discountValue: 15, note: 'Large bulk order' }
     * ]
     */
    quantityDiscounts: {
      type: [QuantityDiscountSchema],
      default: []
    },

    // SEO Meta
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    metaKeywords: [String],

    // Analytics
    viewCount: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Helper method: compute discounted unit price for a given quantity
 * - returns salePrice if present, else regular price
 * - applies best matching discount tier
 */
ProductSchema.methods.priceForQty = function (qty) {
  const base = this.salePrice || this.price;
  if (!Array.isArray(this.quantityDiscounts) || !this.quantityDiscounts.length) {
    return base;
  }

  // Find the best tier that matches the quantity
  const applicableTiers = this.quantityDiscounts.filter(
    tier => qty >= tier.minQty && (!tier.maxQty || qty <= tier.maxQty)
  );

  if (!applicableTiers.length) return base;

  // Get tier with highest minQty (most specific)
  const bestTier = applicableTiers.sort((a, b) => b.minQty - a.minQty)[0];

  if (bestTier.discountType === 'percent') {
    const discountAmount = (bestTier.discountValue / 100) * base;
    return Math.max(0, Number((base - discountAmount).toFixed(2)));
  }

  // flat discount per unit
  return Math.max(0, Number((base - bestTier.discountValue).toFixed(2)));
};

/**
 * Virtual: Get current effective price (sale price if available, else regular price)
 */
ProductSchema.virtual('effectivePrice').get(function () {
  return this.salePrice || this.price;
});

/**
 * Virtual: Check if product is on sale
 */
ProductSchema.virtual('isOnSale').get(function () {
  return this.salePrice && this.salePrice < this.price;
});

/**
 * Virtual: Calculate discount percentage if on sale
 */
ProductSchema.virtual('discountPercent').get(function () {
  if (!this.isOnSale) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

// Index for better query performance
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ categories: 1, visibility: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);