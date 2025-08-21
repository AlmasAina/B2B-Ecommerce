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
  duration: Number,
}, { _id: false });

// Key/value specification rows
const SpecSchema = new Schema({ key: String, value: String }, { _id: false });

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

const ProductSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
  tags: [String],

  highlights: [String],
  descriptionHtml: String,
  specs: [SpecSchema],
  inTheBox: [String],

  price: {
    mrp: Number,
    sale: Number,
    currency: { type: String, default: 'USD' },
  },

  inventory: {
    track: { type: Boolean, default: true },
    qty: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },

  media: [MediaSchema],
  videoUrls: [String],

  options: [VariantOptionSchema],
  variants: [VariantSkuSchema],

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  shipping: {
    weight: Number,
    dimensions: { l: Number, w: Number, h: Number },
    originCountry: String,
    leadTimeDays: Number,
    freeShipping: { type: Boolean, default: false },
  },

  quantityDiscounts: [QuantityDiscountSchema],

  contactOnly: { type: Boolean, default: true },

  seo: {
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,
    ogImage: String,
  },

  status: {
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },

  customFields: { type: Map, of: String },

  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, collection: 'products' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
