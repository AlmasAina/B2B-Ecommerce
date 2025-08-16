
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  const product = await Product.create(data);
  return NextResponse.json({ success: true, product });
}

export async function GET() {
  await dbConnect();

  const products = await Product.find({});
  return NextResponse.json({ success: true, products });
}
