// app/api/posts/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/app/models/Post';
import Category from '@/app/models/Category';
import Tag from '@/app/models/Tag';

// GET all posts
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    // Handle category filter
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    // Handle tag filter
    if (tag && tag !== 'all') {
      const tagDoc = await Tag.findOne({ name: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      }
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const posts = await Post.find(query)
      .populate('categories', 'name slug description')
      .populate('tags', 'name slug')
      .populate({
        path: 'featuredImage.media',
        model: 'Media'
      })
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      details: error.message
    }, { status: 500 });
  }
}

// POST - Create new post
// POST - Create new post
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

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

    // 🖼️ Process media items
    let mediaItems = [];
    if (data.mediaItems && data.mediaItems.length > 0) {
      for (let item of data.mediaItems) {
        // If frontend sends path -> create/find Media doc
        if (typeof item.media === 'string') {
          const Media = (await import('@/app/models/Media')).default || (await import('@/app/models/Media'));
          let mediaDoc = await Media.findOne({ url: item.media });
          if (!mediaDoc) {
            mediaDoc = new Media({
              url: item.media,
              alt: item.alt || '',
              caption: item.caption || ''
            });
            await mediaDoc.save();
          }
          mediaItems.push({
            media: mediaDoc._id,
            role: item.role || 'attachment',
            caption: item.caption || '',
            alt: item.alt || ''
          });
        } else {
          // If frontend already sends ObjectId
          mediaItems.push(item);
        }
      }
    }

    // Create post
    const postData = {
      ...data,
      categories: categoryIds,
      tags: tagIds,
      mediaItems,
      author: 'Admin', // TODO: get from auth context later
      slug: data.permalink || data.title.toLowerCase().replace(/\s+/g, '-'),
      publishDate: data.status === 'published' ? new Date() : null
    };

    const post = new Post(postData);
    await post.save();

    // Populate the response
    const populatedPost = await Post.findById(post._id)
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .populate({ path: 'mediaItems.media', model: 'Media' });

    return NextResponse.json({
      success: true,
      data: populatedPost,
      message: 'Post created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create post',
      details: error.message
    }, { status: 500 });
  }
}
