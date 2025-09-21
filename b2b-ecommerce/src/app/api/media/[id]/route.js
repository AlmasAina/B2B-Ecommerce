// app/api/media/[id]/route.js
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db/mongodb';
import Media from '@/lib/models/Media';

// GET specific media by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const media = await Media.findById(id)
      .populate('categories', 'name slug description');

    if (!media || media.deleted) {
      return NextResponse.json({
        success: false,
        error: 'Media file not found'
      }, { status: 404 });
    }

    // Increment usage count
    await media.incrementUsage();

    return NextResponse.json({
      success: true,
      data: media
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch media file',
      details: error.message
    }, { status: 500 });
  }
}

// PUT - Update specific media
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const data = await request.json();

    // Check if media exists
    const existingMedia = await Media.findById(id);
    if (!existingMedia || existingMedia.deleted) {
      return NextResponse.json({
        success: false,
        error: 'Media file not found'
      }, { status: 404 });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'alt', 'caption', 'description', 'tags', 
      'isPublic', 'requiresAuth'
    ];

    const updateData = {};
    allowedUpdates.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('categories', 'name slug');

    return NextResponse.json({
      success: true,
      data: updatedMedia,
      message: 'Media file updated successfully'
    });

  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update media file',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE specific media
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    const media = await Media.findById(id);
    if (!media || media.deleted) {
      return NextResponse.json({
        success: false,
        error: 'Media file not found'
      }, { status: 404 });
    }

    if (permanent) {
      // Delete physical file for local storage
      if (media.storage?.provider === 'local' && media.path) {
        try {
          const filePath = path.join(process.cwd(), 'public', media.path);
          await unlink(filePath);
        } catch (fileError) {
          console.warn('Could not delete physical file:', fileError.message);
        }
      }

      // Permanently delete from database
      await Media.findByIdAndDelete(id);
      
      return NextResponse.json({
        success: true,
        message: 'Media file permanently deleted'
      });
    } else {
      // Soft delete (move to trash)
      const updatedMedia = await Media.findByIdAndUpdate(
        id,
        { 
          deleted: true,
          deletedAt: new Date()
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        data: updatedMedia,
        message: 'Media file moved to trash'
      });
    }

  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete media file',
      details: error.message
    }, { status: 500 });
  }
}