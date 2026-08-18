import { Timestamp } from 'firebase/firestore';

// ─── Gallery Albums ─────────────────────────────────────────────────────────

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Timestamp;
  coverImageUrl: string;
  coverImagePublicId?: string;
  imageCount: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type GalleryAlbumFormData = Omit<GalleryAlbum, 'id' | 'createdAt' | 'updatedAt' | 'imageCount'>;

// ─── Gallery Images ─────────────────────────────────────────────────────────

export interface GalleryImage {
  id: string;
  albumId: string;
  url: string;
  publicId: string;
  caption: string;
  displayOrder: number;
  createdAt: Timestamp;
}

export type GalleryImageFormData = Omit<GalleryImage, 'id' | 'createdAt'>;
