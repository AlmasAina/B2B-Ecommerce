// app/api/categories/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';

// GET all categories
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const hierarchy = searchParams.get('hierarchy') === 'true';

    if (hierarchy) {
      // Return hierarchical structure
      const categories = await Category.getHierarchy();
      return NextResponse.json({
        success: true,
        data: categories
      });
    } else {
      // Return flat list
      const categories = await Category.find({ isActive: true })
        .populate('image', 'url alt')
        .sort({ name: 1 });

      return NextResponse.json({
        success: true,
        data: categories
      });
    }

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories',
      details: error.message
    }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') }
    });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category with this name already exists'
      }, { status: 400 });
    }

    const category = new Category({
      name: data.name,
      description: data.description || '',
      parent: data.parent || null,
      color: data.color || '#000000',
      image: data.image || null
    });

    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('image', 'url alt')
      .populate('parent', 'name slug');

    return NextResponse.json({
      success: true,
      data: populatedCategory,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create category',
      details: error.message
    }, { status: 500 });
  }
}