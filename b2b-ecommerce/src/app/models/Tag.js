// lib/models/Tag.js
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
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
  count: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#007cba'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
tagSchema.index({ slug: 1 });
tagSchema.index({ name: 1 });
tagSchema.index({ isActive: 1 });

// Auto-generate slug from name if not provided
tagSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
  }
  next();
});

// Static method to get popular tags
tagSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ count: -1 })
    .limit(limit);
};

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);
export default Tag;