
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
    const data = await req.json();
    const product = await Product.create(data);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to add product' }, { status: 500 });
  }
}

// Handle GET request: Fetch all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}
