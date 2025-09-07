// /api/products/route.js - Enhanced Products API with file upload support
import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';

// Validation helper functions
const validateContentBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return 'Content blocks must be an array';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block.id || !block.type || block.order === undefined) {
      return `Block ${i + 1}: Missing required fields (id, type, order)`;
    }

    if (!['text', 'image', 'video', 'image-text', 'gallery', 'video-gallery', 'accordion', 'specifications'].includes(block.type)) {
      return `Block ${i + 1}: Invalid block type`;
    }

    // Validate based on block type
    switch (block.type) {
      case 'text':
      case 'image-text':
        if (!block.content || (!block.content.text && !block.content.heading)) {
          return `Block ${i + 1}: Text blocks must have content`;
        }
        break;

      case 'image':
      case 'gallery':
        if (!block.media || !Array.isArray(block.media) || block.media.length === 0) {
          return `Block ${i + 1}: Image blocks must have media`;
        }
        break;

      case 'video':
      case 'video-gallery':
        if (!block.media || !Array.isArray(block.media) || block.media.length === 0) {
          return `Block ${i + 1}: Video blocks must have media`;
        }
        break;

      case 'accordion':
        if (!block.accordion || !Array.isArray(block.accordion) || block.accordion.length === 0) {
          return `Block ${i + 1}: Accordion blocks must have accordion items`;
        }
        break;
    }
  }

  return null;
};

const validateMediaArray = (media) => {
  if (!Array.isArray(media)) return 'Media must be an array';

  for (let i = 0; i < media.length; i++) {
    const item = media[i];

    if (!item.url) {
      return `Media item ${i + 1}: URL is required`;
    }

    if (item.type && !['image', 'video'].includes(item.type)) {
      return `Media item ${i + 1}: Type must be 'image' or 'video'`;
    }

    if (typeof item.sortOrder !== 'undefined' && isNaN(item.sortOrder)) {
      return `Media item ${i + 1}: Sort order must be a number`;
    }
  }

  return null;
};

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();
    console.log('Received product data:', JSON.stringify(data, null, 2));

    // Enhanced validation
    const errors = {};

    // Basic field validation
    if (!data.title || data.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!data.brand || data.brand.trim().length < 2) {
      errors.brand = 'Brand is required and must be at least 2 characters long';
    }

    if (!data.category) {
      errors.category = 'Category is required';
    }

    if (!data.price?.mrp || data.price.mrp <= 0) {
      errors.price = 'MRP is required and must be greater than 0';
    }

    // Content validation - either simple description or rich content blocks
    const hasSimpleDescription = data.descriptionHtml && data.descriptionHtml.trim().length >= 50;
    const hasRichContent = data.descriptionBlocks && Array.isArray(data.descriptionBlocks) && data.descriptionBlocks.length > 0;

    if (!hasSimpleDescription && !hasRichContent) {
      errors.description = 'Either a simple description (min 50 characters) or rich content blocks are required';
    }

    // Validate rich content blocks if provided
    if (data.descriptionBlocks && data.descriptionBlocks.length > 0) {
      const blockValidationError = validateContentBlocks(data.descriptionBlocks);
      if (blockValidationError) {
        errors.descriptionBlocks = blockValidationError;
      }
    }

    // Media validation
    if (!data.media || !Array.isArray(data.media) || data.media.length === 0) {
      errors.media = 'At least one media item is required';
    } else {
      const mediaValidationError = validateMediaArray(data.media);
      if (mediaValidationError) {
        errors.media = mediaValidationError;
      }
    }

    // Highlights validation
    if (!data.highlights || !Array.isArray(data.highlights) || !data.highlights.some(h => h && h.trim())) {
      errors.highlights = 'At least one highlight is required';
    }

    // Specifications validation
    if (!data.specs || !Array.isArray(data.specs) || !data.specs.some(s => s.key && s.value)) {
      errors.specs = 'At least one specification is required';
    }

    // Validate quantity discounts if provided
    if (data.quantityDiscounts && Array.isArray(data.quantityDiscounts)) {
      for (let i = 0; i < data.quantityDiscounts.length; i++) {
        const discount = data.quantityDiscounts[i];
        if (!discount.minQty || discount.minQty <= 0) {
          errors.quantityDiscounts = `Discount tier ${i + 1}: Minimum quantity must be greater than 0`;
          break;
        }
        if (!discount.discountValue || discount.discountValue <= 0) {
          errors.quantityDiscounts = `Discount tier ${i + 1}: Discount value must be greater than 0`;
          break;
        }
        if (discount.discountType === 'percent' && discount.discountValue > 100) {
          errors.quantityDiscounts = `Discount tier ${i + 1}: Percentage discount cannot exceed 100%`;
          break;
        }
      }
    }

    // Check for duplicate slug
    const existingProduct = await Product.findOne({ slug: data.slug });
    if (existingProduct) {
      errors.slug = 'This slug is already taken';
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        errors,
        message: 'Validation failed'
      }, { status: 400 });
    }

    // Process and clean the data
    const processedData = {
      // Basic info
      title: data.title.trim(),
      slug: data.slug.trim(),
      brand: data.brand.trim(),
      category: data.category,
      tags: data.tags ? data.tags.filter(tag => tag && tag.trim()).map(tag => tag.trim()) : [],

      // Content
      highlights: data.highlights.filter(Boolean).map(h => h.trim()),
      descriptionHtml: data.descriptionHtml ? data.descriptionHtml.trim() : '',
      descriptionBlocks: data.descriptionBlocks || [],
      specs: data.specs.filter(s => s.key && s.value).map(s => ({
        key: s.key.trim(),
        value: s.value.trim(),
        icon: s.icon || undefined,
        order: s.order || 0
      })),
      inTheBox: data.inTheBox ? data.inTheBox.filter(Boolean).map(item => item.trim()) : [],

      // Pricing
      price: {
        mrp: Number(data.price.mrp),
        sale: data.price.sale ? Number(data.price.sale) : undefined,
        currency: data.price.currency || 'USD'
      },

      // Inventory
      inventory: {
        track: Boolean(data.inventory?.track),
        qty: Number(data.inventory?.qty) || 0,
        lowStockThreshold: Number(data.inventory?.lowStockThreshold) || 5
      },

      // Media - process and validate URLs
      media: data.media.filter(m => m.url).map(m => ({
        url: m.url.trim(),
        alt: m.alt ? m.alt.trim() : '',
        type: m.type || 'image',
        isPrimary: Boolean(m.isPrimary),
        sortOrder: Number(m.sortOrder) || 0,
        width: m.width ? Number(m.width) : undefined,
        height: m.height ? Number(m.height) : undefined,
        duration: m.duration ? Number(m.duration) : undefined,
        filename: m.filename || undefined,
        size: m.size ? Number(m.size) : undefined,
        publicId: m.publicId || undefined
      })),

      // External video URLs
      videoUrls: data.videoUrls ? data.videoUrls.filter(Boolean).map(url => url.trim()) : [],

      // Shipping
      shipping: {
        weight: data.shipping?.weight ? Number(data.shipping.weight) : undefined,
        dimensions: {
          l: data.shipping?.dimensions?.l ? Number(data.shipping.dimensions.l) : undefined,
          w: data.shipping?.dimensions?.w ? Number(data.shipping.dimensions.w) : undefined,
          h: data.shipping?.dimensions?.h ? Number(data.shipping.dimensions.h) : undefined
        },
        originCountry: data.shipping?.originCountry ? data.shipping.originCountry.trim() : undefined,
        leadTimeDays: data.shipping?.leadTimeDays ? Number(data.shipping.leadTimeDays) : undefined,
        freeShipping: Boolean(data.shipping?.freeShipping)
      },

      // B2B Features
      quantityDiscounts: data.quantityDiscounts ? data.quantityDiscounts.filter(d => d.minQty && d.discountValue).map(d => ({
        minQty: Number(d.minQty),
        maxQty: d.maxQty ? Number(d.maxQty) : undefined,
        discountType: d.discountType || 'percent',
        discountValue: Number(d.discountValue),
        note: d.note ? d.note.trim() : undefined
      })) : [],

      contactOnly: Boolean(data.contactOnly),

      // SEO
      seo: {
        metaTitle: data.seo?.metaTitle ? data.seo.metaTitle.trim() : undefined,
        metaDescription: data.seo?.metaDescription ? data.seo.metaDescription.trim() : undefined,
        canonicalUrl: data.seo?.canonicalUrl ? data.seo.canonicalUrl.trim() : undefined,
        ogImage: data.seo?.ogImage ? data.seo.ogImage.trim() : undefined
      },

      // Status
      status: {
        isPublished: Boolean(data.status?.isPublished),
        isFeatured: Boolean(data.status?.isFeatured),
        isDiscontinued: false
      },

      // Initialize analytics fields
      searchCount: 0,
      viewCount: 0,
      clickCount: 0,
      trendingScore: 0,
      views: [],
      metrics: {
        last7Days: { views: 0, searches: 0, clicks: 0 },
        last30Days: { views: 0, searches: 0, clicks: 0 }
      },

      // Initialize rating
      rating: {
        average: 0,
        count: 0,
        breakdown: { five: 0, four: 0, three: 0, two: 0, one: 0 }
      },

      reviews: [],

      // Track uploaded files for cleanup if needed
      uploadedFiles: data.uploadedFiles || [],

      // Admin tracking
      createdBy: data.createdBy || undefined,
      moderationStatus: 'pending'
    };

    // Create the product
    const product = new Product(processedData);
    const savedProduct = await product.save();

    console.log('Product created successfully:', savedProduct._id);

    return NextResponse.json({
      success: true,
      product: {
        _id: savedProduct._id,
        title: savedProduct.title,
        slug: savedProduct.slug,
        brand: savedProduct.brand,
        status: savedProduct.status
      },
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `Product with this ${field} already exists`,
        errors: { [field]: `This ${field} is already taken` }
      }, { status: 400 });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });

      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Enhanced GET endpoint with improved search and filtering
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 10, 100); // Max 100 items per page
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const userId = searchParams.get('userId');
    const userIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    // Build query
    let query = {};

    // Only include published products unless specifically requested
    if (!includeUnpublished) {
      query['status.isPublished'] = true;
    }

    let searchTermUsed = '';

    // Search functionality
    if (search && search.trim()) {
      searchTermUsed = search.trim();
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { searchKeywords: { $in: [new RegExp(search, 'i')] } },
        { 'specs.key': { $regex: search, $options: 'i' } },
        { 'specs.value': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$and = query.$and || [];
      const priceQuery = {};

      if (minPrice) {
        priceQuery.$gte = Number(minPrice);
      }
      if (maxPrice) {
        priceQuery.$lte = Number(maxPrice);
      }

      // Check both sale price and MRP
      query.$and.push({
        $or: [
          { 'price.sale': priceQuery },
          { 'price.mrp': priceQuery }
        ]
      });
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'trending':
        sortOptions = { trendingScore: -1, viewCount: -1 };
        break;
      case 'mostSearched':
        sortOptions = { searchCount: -1, clickCount: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'price':
        // Sort by sale price if available, otherwise by MRP
        sortOptions = order === 'desc'
          ? { 'price.sale': -1, 'price.mrp': -1 }
          : { 'price.sale': 1, 'price.mrp': 1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'title':
        sortOptions = { title: order === 'desc' ? -1 : 1 };
        break;
      case 'brand':
        sortOptions = { brand: order === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };
    }

    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug')
        .select('-reviews -views -uploadedFiles'), // Exclude heavy fields
      Product.countDocuments(query)
    ]);

    // Track search analytics if search term was used
    if (searchTermUsed && products.length > 0) {
      try {
        // Import SearchAnalytics if needed
        const { SearchAnalytics } = await import('@/models/Product');

        // Log search analytics
        await SearchAnalytics.create({
          searchTerm: searchTermUsed,
          userId: userId || null,
          userIP,
          resultCount: total,
          clickedProducts: [], // Will be updated when products are clicked
          source: 'web'
        });

        // Increment search count for found products
        const productIds = products.map(p => p._id);
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $inc: { searchCount: 1 } }
        );
      } catch (analyticsError) {
        console.error('Error tracking search analytics:', analyticsError);
        // Don't fail the request if analytics fail
      }
    }

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      },
      searchTerm: searchTermUsed,
      appliedFilters: {
        category,
        brand,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        sortBy,
        order
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}