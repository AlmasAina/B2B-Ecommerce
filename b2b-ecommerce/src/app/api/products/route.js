
// import dbConnect from '@/lib/dbConnect';
// import Product from '@/app/models/Product';
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();
//   const data = await req.json();

//   const product = await Product.create(data);
//   return NextResponse.json({ success: true, product });
// }

// export async function GET() {
//   await dbConnect();

//   const products = await Product.find({});
//   return NextResponse.json({ success: true, products });
// }

// /app/api/products/route.js

import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';
import { NextResponse } from 'next/server';

// Handle POST request: Add new product
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic defensive parsing for nested arrays/maps coming from the admin form
    const payload = {
      title: body.title,
      slug: body.slug,
      brand: body.brand,
      category: body.category || undefined,
      tags: body.tags || [],

      highlights: body.highlights || [],
      descriptionHtml: body.descriptionHtml || '',
      specs: body.specs || [],
      inTheBox: body.inTheBox || [],

      price: body.price || {},
      inventory: body.inventory || {},

      media: body.media || [],
      videoUrls: body.videoUrls || [],

      options: body.options || [],
      variants: body.variants || [],

      rating: body.rating || undefined,
      shipping: body.shipping || {},

      quantityDiscounts: body.quantityDiscounts || [],
      contactOnly: body.contactOnly !== false,

      seo: body.seo || {},
      status: body.status || {},
      customFields: body.customFields || {},
    };

    const product = await Product.create(payload);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to add product' }, { status: 500 });
  }
}

// Handle GET request: Fetch all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch products' }, { status: 500 });
  }
}
