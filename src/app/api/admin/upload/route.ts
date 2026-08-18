import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/api/middleware';
import { uploadImage, CLOUDINARY_FOLDERS } from '@/lib/cloudinary/config';
import fs from 'fs';
import path from 'path';

/**
 * Save base64 image data to public/uploads/ as local fallback.
 */
function saveLocalImage(base64Data: string, subfolder: string): { url: string; publicId: string } | null {
  try {
    let mimeType = 'image/jpeg';
    let rawBase64 = base64Data;

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      rawBase64 = matches[2];
    }

    const buffer = Buffer.from(rawBase64, 'base64');
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';

    const cleanFolder = subfolder.replace(/^sdwa\/?/, '').replace(/^\/+|\/+$/g, '') || 'general';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', cleanFolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${cleanFolder}/${filename}`;
    const publicId = `local_${cleanFolder}_${filename}`;

    return { url: publicUrl, publicId };
  } catch (err) {
    console.error('Local fallback upload error:', err);
    return null;
  }
}

/**
 * POST /api/admin/upload
 * Upload an image: Tries Cloudinary first, gracefully falls back to local storage if Cloudinary returns 403 or fails.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { file, folder, publicId } = await request.json();

    if (!file) {
      return errorResponse('File is required', 400);
    }

    // Clean folder name
    let targetFolder = (folder || CLOUDINARY_FOLDERS.BRANDING).trim();
    if (!targetFolder.startsWith('sdwa')) {
      targetFolder = `sdwa/${targetFolder.replace(/^\/+/, '')}`;
    }

    // 1. Try Cloudinary upload if real credentials exist
    try {
      if (
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret'
      ) {
        const result = await uploadImage(file, targetFolder, { publicId });
        return successResponse(result, 201);
      }
    } catch (cldErr: any) {
      console.warn('Cloudinary upload unsuccessful, activating local fallback:', cldErr?.message || cldErr);
    }

    // 2. Fallback to local storage
    if (typeof file === 'string' && file.startsWith('data:')) {
      const localResult = saveLocalImage(file, targetFolder);
      if (localResult) {
        return successResponse(
          {
            url: localResult.url,
            secureUrl: localResult.url,
            publicId: localResult.publicId,
            width: 800,
            height: 600,
          },
          201
        );
      }
    }

    return errorResponse('Upload failed. Please check image data format.', 500);
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return errorResponse(error?.message || 'Upload failed', 500);
  }
}
