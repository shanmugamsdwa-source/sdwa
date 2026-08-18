import { MetadataRoute } from 'next';
import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, Tournament, Achievement, AffiliatedInstitution, GalleryAlbum } from '@/types';

/**
 * Dynamic sitemap generation.
 * Queries Firestore for all published entities and generates URLs
 * for achievements, tournaments, institutions, and gallery albums.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sdwa.in';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tournaments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/affiliated-centres`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // 1. Achievements
    const achievements = await getCollection<Achievement>(COLLECTIONS.ACHIEVEMENTS, {
      where: [['isPublished', '==', true]],
    });
    for (const a of achievements) {
      const slugOrId = (a as any).slug || a.id;
      if (slugOrId) {
        dynamicPages.push({
          url: `${baseUrl}/achievements/${slugOrId}`,
          lastModified: a.updatedAt ? a.updatedAt.toDate() : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }

    // 2. Tournaments
    const tournaments = await getCollection<Tournament>(COLLECTIONS.TOURNAMENTS, {
      where: [['isPublished', '==', true]],
    });
    for (const t of tournaments) {
      const slugOrId = (t as any).slug || t.id;
      if (slugOrId) {
        dynamicPages.push({
          url: `${baseUrl}/tournaments/${slugOrId}`,
          lastModified: t.updatedAt ? t.updatedAt.toDate() : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    // 3. Affiliated Centres
    const centres = await getCollection<AffiliatedInstitution>(COLLECTIONS.AFFILIATED_CENTRES);
    for (const centre of centres) {
      const isPub = centre.isPublished !== false && centre.isActive !== false;
      if (isPub && (centre.slug || centre.id)) {
        dynamicPages.push({
          url: `${baseUrl}/affiliated-centres/${centre.slug || centre.id}`,
          lastModified: centre.updatedAt && typeof (centre.updatedAt as any).toDate === 'function'
            ? (centre.updatedAt as any).toDate()
            : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // 4. Albums
    const albums = await getCollection<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, {
      where: [['isPublished', '==', true]],
    });
    for (const album of albums) {
      if (album.slug || album.id) {
        dynamicPages.push({
          url: `${baseUrl}/gallery/${album.slug || album.id}`,
          lastModified: album.updatedAt ? album.updatedAt.toDate() : new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      }
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  return [...staticPages, ...dynamicPages];
}
