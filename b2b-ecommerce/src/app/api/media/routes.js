// // api/media/route.js
// import dbConnect from '@/lib/dbConnect';
// import { NextResponse } from 'next/server';
// import Media from '@/app/models/Media';

// export async function GET(req) {
//     try {
//         await dbConnect();

//         const { searchParams } = new URL(req.url);
//         const type = searchParams.get('type'); // 'image', 'video', 'audio', 'document', 'embed'
//         const search = searchParams.get('search');
//         const page = parseInt(searchParams.get('page')) || 1;
//         const limit = parseInt(searchParams.get('limit')) || 20;
//         const skip = (page - 1) * limit;
//         const sortBy = searchParams.get('sortBy') || 'createdAt';
//         const sortOrder = searchParams.get('sortOrder') || 'desc';
//         const tags = searchParams.get('tags')?.split(',');

//         // Build query
//         let query = { deleted: false };

//         if (type && type !== 'all') {
//             query.type = type;
//         }

//         if (search) {
//             query.$or = [
//                 { originalName: { $regex: search, $options: 'i' } },
//                 { alt: { $regex: search, $options: 'i' } },
//                 { caption: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { tags: { $regex: search, $options: 'i' } }
//             ];
//         }

//         if (tags && tags.length > 0) {
//             query.tags = { $in: tags };
//         }

//         // Build sort object
//         const sort = {};
//         sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//         // Get media items
//         const mediaItems = await Media.find(query)
//             .sort(sort)
//             .limit(limit)
//             .skip(skip)
//             .lean();

//         // Get total count for pagination
//         const total = await Media.countDocuments(query);

//         // Get type counts for filters
//         const typeCounts = await Media.aggregate([
//             { $match: { deleted: false } },
//             { $group: { _id: '$type', count: { $sum: 1 } } }
//         ]);

//         const counts = {
//             all: total,
//             image: 0,
//             video: 0,
//             audio: 0,
//             document: 0,
//             embed: 0
//         };

//         typeCounts.forEach(item => {
//             if (item._id) {
//                 counts[item._id] = item.count;
//             }
//         });

//         return NextResponse.json({
//             success: true,
//             mediaItems,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit),
//                 hasNext: page < Math.ceil(total / limit),
//                 hasPrev: page > 1
//             },
//             typeCounts: counts
//         });
//     } catch (error) {
//         console.error('Error fetching media:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// export async function POST(req) {
//     try {
//         await dbConnect();
//         const body = await req.json();

//         const { type } = body;

//         // Handle embed media (YouTube, Instagram, etc.)
//         if (type === 'embed') {
//             const { url, platform, embedHtml, title, description, thumbnail } = body;

//             if (!url) {
//                 return NextResponse.json(
//                     { success: false, error: 'URL is required for embed media' },
//                     { status: 400 }
//                 );
//             }

//             const mediaData = {
//                 filename: `embed-${Date.now()}`,
//                 originalName: title || url,
//                 path: '',
//                 url: url,
//                 mimetype: 'text/html',
//                 size: 0,
//                 type: 'embed',
//                 embedData: {
//                     platform: platform || 'direct',
//                     embedUrl: url,
//                     embedHtml: embedHtml || '',
//                     thumbnail: thumbnail || '',
//                     title: title || '',
//                     description: description || ''
//                 },
//                 alt: title || '',
//                 uploadedBy: body.uploadedBy || 'Admin'
//             };

//             const media = await Media.create(mediaData);
//             return NextResponse.json({
//                 success: true,
//                 media
//             }, { status: 201 });
//         }

//         // For other media types, this would typically be handled by the upload route
//         return NextResponse.json(
//             { success: false, error: 'Use /api/media/upload for file uploads' },
//             { status: 400 }
//         );

//     } catch (error) {
//         console.error('Error creating media:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// export async function PUT(req) {
//     try {
//         await dbConnect();
//         const body = await req.json();
//         const { id, alt, caption, description, tags } = body;

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, error: 'Media ID is required' },
//                 { status: 400 }
//             );
//         }

//         const updateData = {};
//         if (alt !== undefined) updateData.alt = alt;
//         if (caption !== undefined) updateData.caption = caption;
//         if (description !== undefined) updateData.description = description;
//         if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

//         const media = await Media.findByIdAndUpdate(id, updateData, {
//             new: true,
//             runValidators: true
//         });

//         if (!media) {
//             return NextResponse.json(
//                 { success: false, error: 'Media not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             media
//         });
//     } catch (error) {
//         console.error('Error updating media:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(req) {
//     try {
//         await dbConnect();
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');
//         const permanent = searchParams.get('permanent') === 'true';

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, error: 'Media ID is required' },
//                 { status: 400 }
//             );
//         }

//         if (permanent) {
//             // Permanent deletion - also delete file from storage
//             const media = await Media.findByIdAndDelete(id);
//             if (!media) {
//                 return NextResponse.json(
//                     { success: false, error: 'Media not found' },
//                     { status: 404 }
//                 );
//             }

//             // TODO: Delete physical file from storage
//             // This would depend on your storage solution (local, S3, etc.)

//             return NextResponse.json({
//                 success: true,
//                 message: 'Media permanently deleted'
//             });
//         } else {
//             // Soft delete
//             const media = await Media.findByIdAndUpdate(
//                 id,
//                 {
//                     deleted: true,
//                     deletedAt: new Date()
//                 },
//                 { new: true }
//             );

//             if (!media) {
//                 return NextResponse.json(
//                     { success: false, error: 'Media not found' },
//                     { status: 404 }
//                 );
//             }

//             return NextResponse.json({
//                 success: true,
//                 message: 'Media moved to trash'
//             });
//         }
//     } catch (error) {
//         console.error('Error deleting media:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// app/api/media/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Media from '@/lib/models/Media';

// GET all media with filtering, searching, and pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build query object
    let query = { deleted: false };

    // Add search functionality
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type !== 'all') {
      query.type = type;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Get media files
    const mediaFiles = await Media.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .populate('categories', 'name slug');

    // Get total count for pagination
    const total = await Media.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    // Get statistics
    const stats = await Media.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: mediaFiles,
      pagination: {
        current: page,
        total: totalPages,
        limit: limit,
        count: mediaFiles.length,
        totalFiles: total
      },
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch media files',
      details: error.message
    }, { status: 500 });
  }
}

// POST - Create media entry (for URL embeds or direct media records)
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.url && !data.filename) {
      return NextResponse.json({
        success: false,
        error: 'URL or filename is required'
      }, { status: 400 });
    }

    let mediaData = {};

    // Handle URL embeds (YouTube, Instagram, etc.)
    if (data.embedData) {
      mediaData = {
        filename: data.filename || `embed_${Date.now()}`,
        originalName: data.originalName || data.filename || 'Embedded Content',
        path: data.url || '',
        url: data.url,
        mimetype: 'text/html',
        size: 0,
        type: 'embed',
        embedData: {
          platform: data.embedData.platform,
          embedUrl: data.embedData.embedUrl || data.url,
          embedHtml: data.embedData.embedHtml || '',
          thumbnail: data.embedData.thumbnail || '',
          title: data.embedData.title || '',
          description: data.embedData.description || ''
        },
        alt: data.alt || '',
        caption: data.caption || '',
        description: data.description || '',
        tags: data.tags || [],
        uploadedBy: data.uploadedBy || 'Admin'
      };

      // Set metadata for embeds
      if (data.embedData.width && data.embedData.height) {
        mediaData.metadata = {
          width: data.embedData.width,
          height: data.embedData.height,
          aspectRatio: `${data.embedData.width}:${data.embedData.height}`
        };
      }
    } else {
      // Handle regular file data
      mediaData = {
        filename: data.filename,
        originalName: data.originalName,
        path: data.path,
        url: data.url,
        mimetype: data.mimetype,
        size: data.size || 0,
        type: data.type,
        alt: data.alt || '',
        caption: data.caption || '',
        description: data.description || '',
        tags: data.tags || [],
        uploadedBy: data.uploadedBy || 'Admin',
        metadata: data.metadata || {},
        storage: data.storage || { provider: 'local' }
      };
    }

    // Create the media record
    const media = new Media(mediaData);
    await media.save();

    return NextResponse.json({
      success: true,
      data: media,
      message: 'Media record created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating media record:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create media record',
      details: error.message
    }, { status: 500 });
  }
}