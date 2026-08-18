// ─── Cloudinary URL Utilities ────────────────────────────────────────────────
// Client-safe utilities for generating optimized image URLs.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Generate an optimized Cloudinary image URL with transformations.
 */
export function getImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
    gravity?: 'auto' | 'face' | 'center';
  }
): string {
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.gravity) transforms.push(`g_${options.gravity}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);
  if (options?.format) transforms.push(`f_${options.format}`);

  // Default optimizations
  if (!options?.quality) transforms.push('q_auto');
  if (!options?.format) transforms.push('f_auto');

  const transformation = transforms.length > 0 ? `/${transforms.join(',')}` : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${transformation}/${publicId}`;
}

/**
 * Generate a thumbnail URL.
 */
export function getThumbnailUrl(
  publicId: string,
  size: number = 200
): string {
  return getImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
  });
}

/**
 * Generate a responsive image URL for a given width.
 */
export function getResponsiveUrl(
  publicId: string,
  width: number
): string {
  return getImageUrl(publicId, {
    width,
    crop: 'limit',
  });
}

/**
 * Generate srcSet for responsive images.
 */
export function getSrcSet(
  publicId: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map((w) => `${getResponsiveUrl(publicId, w)} ${w}w`)
    .join(', ');
}
