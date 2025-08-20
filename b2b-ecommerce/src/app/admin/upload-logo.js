// pages/api/admin/upload-logo.js (or app/api/admin/upload-logo/route.js for App Router)
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            error: `Method ${req.method} Not Allowed`
        });
    }

    try {
        const form = new IncomingForm({
            uploadDir: path.join(process.cwd(), 'public/uploads/logos'),
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB limit
        });

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads/logos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        const logoFile = files.logo;
        if (!logoFile) {
            return res.status(400).json({
                success: false,
                error: 'No logo file provided'
            });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(logoFile.mimetype)) {
            // Delete uploaded file
            fs.unlinkSync(logoFile.filepath);
            return res.status(400).json({
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
            });
        }

        // Generate unique filename
        const fileExtension = path.extname(logoFile.originalFilename);
        const fileName = `logo-${Date.now()}${fileExtension}`;
        const newPath = path.join(uploadDir, fileName);

        // Move file to final location
        fs.renameSync(logoFile.filepath, newPath);

        // Return the URL path
        const logoUrl = `/uploads/logos/${fileName}`;

        res.status(200).json({
            success: true,
            logoUrl,
            message: 'Logo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload logo'
        });
    }
}