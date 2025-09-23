// app/api/test/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json({
      success: true,
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'API test failed',
      error: error.message,
      database: 'Disconnected'
    }, { status: 500 });
  }
}