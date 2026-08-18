import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, errorResponse, successResponse } from '@/lib/api/middleware';
import { deleteImage, deleteImages } from '@/lib/cloudinary/config';

/**
 * POST /api/admin/upload/delete
 * Delete one or multiple images from Cloudinary server-side.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { publicId, publicIds } = body;

    if (publicId && typeof publicId === 'string') {
      await deleteImage(publicId);
      return successResponse({ message: 'Image deleted successfully' });
    }

    if (Array.isArray(publicIds) && publicIds.length > 0) {
      await deleteImages(publicIds);
      return successResponse({ message: 'Images deleted successfully' });
    }

    return errorResponse('publicId or publicIds is required', 400);
  } catch (error: unknown) {
    console.error('Cloudinary delete error:', error);
    const message = error instanceof Error ? error.message : 'Delete failed';
    return errorResponse(message, 500);
  }
}
