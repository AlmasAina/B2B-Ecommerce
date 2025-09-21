// app/api/tags/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Tag from '@/lib/models/Tag';

// GET all tags
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const popular = searchParams.get('popular') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (popular) {
      const tags = await Tag.getPopular(limit);
      return NextResponse.json({
        success: true,
        data: tags
      });
    }

    const tags = await Tag.find({ isActive: true })
      .sort({ name: 1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: tags
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tags',
      details: error.message
    }, { status: 500 });
  }
}

// POST - Create new tag
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({
        success: false,
        error: 'Tag name is required'
      }, { status: 400 });
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') }
    });

    if (existingTag) {
      return NextResponse.json({
        success: false,
        error: 'Tag with this name already exists'
      }, { status: 400 });
    }

    const tag = new Tag({
      name: data.name,
      description: data.description || '',
      color: data.color || '#007cba'
    });

    await tag.save();

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create tag',
      details: error.message
    }, { status: 500 });
  }
}