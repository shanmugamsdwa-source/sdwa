import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBySlugOrId, getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, GalleryAlbum, GalleryImage } from '@/types';
import { Camera, Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import AlbumPhotosClient from './AlbumPhotosClient';
import { formatDisplayDate } from '@/lib/utils/formatDate';

interface GalleryAlbumPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: GalleryAlbumPageProps) {
  const { slug } = await params;
  const album = await getBySlugOrId<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, slug);

  if (!album) {
    return {
      title: 'Album Not Found | SDWA',
    };
  }

  return {
    title: `${album.title} | SDWA Official Photo Gallery`,
    description: album.description || `Official photographs from ${album.title}`,
    openGraph: {
      title: `${album.title} | SDWA`,
      description: album.description,
      images: album.coverImageUrl ? [album.coverImageUrl] : ['/images/sdwa-logo.png'],
    },
  };
}

export default async function GalleryAlbumPage({ params }: GalleryAlbumPageProps) {
  const { slug } = await params;
  const album = await getBySlugOrId<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, slug);

  if (!album) {
    notFound();
  }

  // Fetch images belonging to this album
  let photos: GalleryImage[] = [];
  try {
    photos = await getCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES, {
      where: [['albumId', '==', album.id]],
      orderBy: 'displayOrder',
    });
  } catch (error) {
    console.error('Error fetching album photos:', error);
  }

  return (
    <main className="min-h-screen py-16 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Albums</span>
          </Link>
        </div>

        {/* Album Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              Official Media Album
            </span>
            {album.date && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{formatDisplayDate(album.date)}</span>
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono">
              {photos.length} photograph{photos.length === 1 ? '' : 's'}
            </span>
          </div>

          <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight leading-tight">
            {album.title}
          </h1>

          {album.description && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              {album.description}
            </p>
          )}
        </div>

        {/* Dynamic Masonry Photos & Lightbox */}
        <AlbumPhotosClient photos={photos} albumTitle={album.title} />
      </div>
    </main>
  );
}
