import { v2 as cloudinary } from 'cloudinary';

// ─── Cloudinary Configuration ───────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ─── Cloudinary Folder Structure ────────────────────────────────────────────
// sdwa/
// ├── branding/
// ├── committee/
// ├── achievements/
// │   ├── senior-men/
// │   ├── junior-men/
// │   └── ...
// ├── tournaments/
// ├── institutions/
// └── gallery/

export const CLOUDINARY_FOLDERS = {
  BRANDING: 'sdwa/branding',
  COMMITTEE: 'sdwa/committee',
  ACHIEVEMENTS: 'sdwa/achievements',
  TOURNAMENTS: 'sdwa/tournaments',
  INSTITUTIONS: 'sdwa/institutions',
  GALLERY: 'sdwa/gallery',
} as const;

// ─── Upload ─────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Upload an image to Cloudinary from a base64 string or URL.
 */
export async function uploadImage(
  file: string,
  folder: string,
  options?: {
    publicId?: string;
    transformation?: Record<string, unknown>;
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    public_id: options?.publicId,
    overwrite: true,
    resource_type: 'auto',
    transformation: options?.transformation,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Delete multiple images from Cloudinary.
 */
export async function deleteImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  await cloudinary.api.delete_resources(publicIds);
}
