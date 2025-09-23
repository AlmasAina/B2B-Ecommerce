// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/app/models/Post';
import Category from '@/app/models/Category';
import Tag from '@/app/models/Tag';
// GET specific post by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const post = await Post.findById(id)
      .populate({
        path: 'featuredImage.media',
        model: 'Media'
      })
      .populate({
        path: 'mediaItems.media',
        model: 'Media'
      })
      .populate({
        path: 'socialEmbeds.mediaId',
        model: 'Media'
      })
      .populate('categories', 'name slug description')
      .populate('tags', 'name slug');

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Increment view count if post is published
    if (post.status === 'published') {
      post.viewCount += 1;
      await post.save();
    }

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch post',
      details: error.message
    }, { status: 500 });
  }
}

// PUT - Update specific post
export async function PUT(request, { params }) {
  try {
     await dbConnect();

    const { id } = params;
    const data = await request.json();

    // Check if post exists
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Create revision before updating
    if (existingPost.content !== data.content || existingPost.title !== data.title) {
      await existingPost.createRevision('Updated via API');
    }

    // Process categories
    let categoryIds = [];
    if (data.categories && data.categories.length > 0) {
      for (let catName of data.categories) {
        let category = await Category.findOne({ name: catName });
        if (!category) {
          category = new Category({
            name: catName,
            slug: catName.toLowerCase().replace(/\s+/g, '-'),
            description: `Category for ${catName}`
          });
          await category.save();
        }
        categoryIds.push(category._id);
      }
    }

    // Process tags
    let tagIds = [];
    if (data.tags && data.tags.length > 0) {
      for (let tagName of data.tags) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
    }

    // Prepare update data
    const updateData = {
      ...data,
      categories: categoryIds,
      tags: tagIds,
      updatedAt: new Date()
    };

    // Handle status change (e.g., draft to published)
    if (data.status === 'published' && existingPost.status !== 'published') {
      updateData.publishDate = new Date();
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .populate({
        path: 'featuredImage.media',
        model: 'Media'
      })
      .populate({
        path: 'mediaItems.media',
        model: 'Media'
      });

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update post',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE specific post
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    if (permanent) {
      // Permanently delete
      await Post.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: 'Post permanently deleted'
      });
    } else {
      // Move to trash (soft delete)
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { 
          status: 'trash',
          deletedAt: new Date()
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        data: updatedPost,
        message: 'Post moved to trash'
      });
    }

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete post',
      details: error.message
    }, { status: 500 });
  }
}