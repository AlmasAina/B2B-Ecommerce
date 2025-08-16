
import dbConnect from '@/lib/dbConnect';
import Product from "@/models/Product";
import Product from "@/models/Product"
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const product = await Product.create(data);
  return NextResponse.json({ success: true, product });
}

export async function GET() {
  await connectDB();

  const products = await Product.find({});
  return NextResponse.json({ success: true, products });
}
