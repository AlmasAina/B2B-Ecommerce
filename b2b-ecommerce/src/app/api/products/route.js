// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import Product from '@/app/models/Product';
import dbConnect from '@/lib/dbConnect';

/**
 * Enhanced Product API Route with B2B Features
 * 
 * This API handles CRUD operations for products including:
 * - Basic product information
 * - Media gallery management
 * - B2B quantity discount tiers
 * - SEO metadata
 * - Comprehensive validation
 */

/**
 * Validate quantity discount tiers
 * Ensures business logic consistency for B2B pricing
 */
function validateQuantityDiscounts(discounts = []) {
  if (!Array.isArray(discounts)) {
    return 'Quantity discounts must be an array';
  }

  // Sort tiers by minQty for validation
  const sortedTiers = [...discounts].sort((a, b) => Number(a.minQty) - Number(b.minQty));

  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];

    // Basic validation
    if (!tier.minQty || Number(tier.minQty) <= 0) {
      return `Discount tier ${i + 1}: Minimum quantity must be greater than 0`;
    }

    if (tier.maxQty && Number(tier.maxQty) < Number(tier.minQty)) {
      return `Discount tier ${i + 1}: Maximum quantity must be greater than or equal to minimum quantity`;
    }

    if (!tier.discountValue || Number(tier.discountValue) <= 0) {
      return `Discount tier ${i + 1}: Discount value must be greater than 0`;
    }

    // Validate discount type and value ranges
    if (tier.discountType === 'percent' && Number(tier.discountValue) > 100) {
      return `Discount tier ${i + 1}: Percentage discount cannot exceed 100%`;
    }

    if (!['percent', 'flat'].includes(tier.discountType || 'percent')) {
      return `Discount tier ${i + 1}: Discount type must be 'percent' or 'flat'`;
    }

    // Check for overlapping ranges
    if (i > 0) {
      const prevTier = sortedTiers[i - 1];
      if (prevTier.maxQty && Number(tier.minQty) <= Number(prevTier.maxQty)) {
        return `Discount tier ${i + 1}: Quantity ranges cannot overlap`;
      }
    }
  }

  return null;
}

/**
 * Validate media items
 */
function validateMedia(media = []) {
  if (!Array.isArray(media) || media.length === 0) {
    return 'At least one media item is required';
  }

  for (let i = 0; i < media.length; i++) {
    const item = media[i];

    if (!item.url) {
      return `Media item ${i + 1}: URL is required`;
    }

    try {
      new URL(item.url);
    } catch {
      return `Media item ${i + 1}: Invalid URL format`;
    }

    if (!['image', 'video', 'embed'].includes(item.type)) {
      return `Media item ${i + 1}: Type must be 'image', 'video', or 'embed'`;
    }

    if (item.type === 'embed' && !item.embedType) {
      return `Media item ${i + 1}: Embed type is required for embed media`;
    }
  }

  return null;
}

/**
 * Sanitize and prepare product data
 */
function sanitizeProductData(body) {
  return {
    title: body.title?.trim(),
    slug: body.slug?.trim()?.toLowerCase(),
    sku: body.sku?.trim(),
    brand: body.brand?.trim(),
    description: body.description?.trim(),
    shortDescription: body.shortDescription?.trim(),
    features: Array.isArray(body.features) ? body.features.filter(Boolean).map(f => f.trim()) : [],
    specifications: Array.isArray(body.specifications)
      ? body.specifications.filter(s => s.key && s.value).map(s => ({
        key: s.key.trim(),
        value: s.value.trim(),
        order: s.order || 0
      }))
      : [],
    media: Array.isArray(body.media)
      ? body.media.filter(m => m.url).map((m, index) => ({
        type: m.type || 'image',
        url: m.url.trim(),
        alt: m.alt?.trim() || '',
        width: m.width ? Number(m.width) : undefined,
        height: m.height ? Number(m.height) : undefined,
        isPrimary: Boolean(m.isPrimary),
        sortOrder: m.sortOrder || index,
        duration: m.duration ? Number(m.duration) : undefined,
        embedType: m.embedType || undefined
      }))
      : [],
    videoUrls: Array.isArray(body.videoUrls)
      ? body.videoUrls.filter(Boolean).map(u => u.trim())
      : [],
    price: body.price ? Number(body.price) : undefined,
    salePrice: body.salePrice ? Number(body.salePrice) : undefined,
    currency: body.currency || 'USD',
    stock: Number(body.stock) || 0,
    manageStock: Boolean(body.manageStock),
    inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
    lowStockThreshold: Number(body.lowStockThreshold) || 5,
    categories: Array.isArray(body.categories) ? body.categories : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    visibility: body.visibility || 'draft',
    status: body.status || 'active',
    featured: Boolean(body.featured),
    quantityDiscounts: Array.isArray(body.quantityDiscounts)
      ? body.quantityDiscounts
        .filter(d => d.minQty && d.discountValue)
        .map(d => ({
          minQty: Number(d.minQty),
          maxQty: d.maxQty ? Number(d.maxQty) : undefined,
          discountType: d.discountType || 'percent',
          discountValue: Number(d.discountValue),
          note: d.note?.trim() || undefined
        }))
      : [],
    metaTitle: body.metaTitle?.trim(),
    metaDescription: body.metaDescription?.trim(),
    metaKeywords: Array.isArray(body.metaKeywords) ? body.metaKeywords : []
  };
}

/**
 * CREATE Product
 * POST /api/products
 */
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const sanitizedData = sanitizeProductData(body);

    // Comprehensive validation
    const errors = {};

    // Basic required fields
    if (!sanitizedData.title || sanitizedData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!sanitizedData.slug) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(sanitizedData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!sanitizedData.description || sanitizedData.description.length < 50) {
      errors.description = 'Description must be at least 50 characters long';
    }

    if (!sanitizedData.price || sanitizedData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (sanitizedData.salePrice && sanitizedData.salePrice >= sanitizedData.price) {
      errors.salePrice = 'Sale price must be less than regular price';
    }

    // Media validation
    const mediaError = validateMedia(sanitizedData.media);
    if (mediaError) {
      errors.media = mediaError;
    }

    // B2B discount validation
    const discountError = validateQuantityDiscounts(sanitizedData.quantityDiscounts);
    if (discountError) {
      errors.quantityDiscounts = discountError;
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }

    // Check for unique slug
    const existingProduct = await Product.findOne({ slug: sanitizedData.slug });
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product with this slug already exists',
          errors: { slug: 'Slug must be unique' }
        },
        { status: 400 }
      );
    }

    // Create the product
    const product = await Product.create(sanitizedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product: {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          visibility: product.visibility
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Product creation error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `${field} already exists`,
          errors: { [field]: `This ${field} is already in use` }
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET Products (List with filters and pagination)
 * GET /api/products
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100); // Max 100 per page
    const visibility = searchParams.get('visibility');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query = {};

    if (visibility && ['visible', 'hidden', 'draft'].includes(visibility)) {
      query.visibility = visibility;
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * UPDATE Product
 * PUT /api/products
 */
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeProductData(updateData);

    // Validation (same as POST but for updates)
    const errors = {};

    if (sanitizedData.title && sanitizedData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (sanitizedData.slug && !/^[a-z0-9-]+$/.test(sanitizedData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (sanitizedData.price && sanitizedData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (sanitizedData.salePrice && sanitizedData.salePrice >= sanitizedData.price) {
      errors.salePrice = 'Sale price must be less than regular price';
    }

    if (sanitizedData.media) {
      const mediaError = validateMedia(sanitizedData.media);
      if (mediaError) errors.media = mediaError;
    }

    if (sanitizedData.quantityDiscounts) {
      const discountError = validateQuantityDiscounts(sanitizedData.quantityDiscounts);
      if (discountError) errors.quantityDiscounts = discountError;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Check slug uniqueness if it's being updated
    if (sanitizedData.slug) {
      const existingProduct = await Product.findOne({
        slug: sanitizedData.slug,
        _id: { $ne: _id }
      });
      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            message: 'Slug already exists',
            errors: { slug: 'This slug is already in use by another product' }
          },
          { status: 400 }
        );
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { ...sanitizedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE Product
 * DELETE /api/products
 */
export async function DELETE(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}