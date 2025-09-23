// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import Media from '@/app/models/Media';

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files provided'
      }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = path.join(uploadDir, uniqueFilename);

      // Ensure upload directory exists
      try {
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      } catch (error) {
        console.error('Error creating upload directory:', error);
      }

      // Convert file to buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      try {
        await writeFile(filePath, buffer);
      } catch (writeError) {
        console.error('Error writing file:', writeError);
        continue; // Skip this file and continue with others
      }

      // Determine file type
      let fileType = 'file';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type.startsWith('audio/')) {
        fileType = 'audio';
      }

      // Create media record
      const mediaData = {
        filename: uniqueFilename,
        originalName: file.name,
        path: `/uploads/${uniqueFilename}`,
        url: `/uploads/${uniqueFilename}`,
        mimetype: file.type,
        size: file.size,
        type: fileType,
        uploadedBy: 'Admin', // You can get this from auth context
        storage: {
          provider: 'local',
          path: filePath
        }
      };

      // Add image metadata if it's an image
      if (fileType === 'image') {
        // You could add image processing here to get dimensions
        mediaData.metadata = {
          width: null,
          height: null,
          aspectRatio: null
        };
      }

      const media = new Media(mediaData);
      await media.save();
      uploadedFiles.push(media);
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files were successfully uploaded'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed',
      details: error.message
    }, { status: 500 });
  }
}