import { Timestamp } from 'firebase/firestore';

// ─── Cloudinary Image ───────────────────────────────────────────────────────

export interface CloudinaryImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

// ─── Achievement Categories ─────────────────────────────────────────────────

export interface AchievementCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export type AchievementCategoryFormData = Omit<AchievementCategory, 'id'>;

// ─── Achievement Levels ─────────────────────────────────────────────────────

export interface AchievementLevel {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export type AchievementLevelFormData = Omit<AchievementLevel, 'id'>;

// ─── Achievements ───────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  eventName: string;
  categoryId: string;
  levelId: string;
  startYear: number;
  endYear: number;
  season: string;
  venue: string;
  description: string;
  images: CloudinaryImage[];
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AchievementFormData = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt' | 'season'>;

// ─── With resolved references ───────────────────────────────────────────────

export interface AchievementWithRefs extends Achievement {
  category?: AchievementCategory;
  level?: AchievementLevel;
}
