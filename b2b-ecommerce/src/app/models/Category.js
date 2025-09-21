// lib/models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  count: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#000000'
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting child categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ isActive: 1 });

// Auto-generate slug from name if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
  }
  next();
});

// Static method to get category hierarchy
categorySchema.statics.getHierarchy = function() {
  return this.find({ parent: null })
    .populate({
      path: 'children',
      populate: {
        path: 'children'
      }
    })
    .sort({ order: 1, name: 1 });
};

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;