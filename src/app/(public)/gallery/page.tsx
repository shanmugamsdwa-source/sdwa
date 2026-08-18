import Link from 'next/link';
import Image from 'next/image';
import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, GalleryAlbum } from '@/types';
import { Images, Camera, Calendar, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/public/EmptyState';
import { formatDisplayDate } from '@/lib/utils/formatDate';
import GalleryAlbumsClient from './GalleryAlbumsClient';
export const metadata = {
  title: 'Competition & Championship Photo Gallery | SDWA',
  description:
    'Official photography archive of Salem District Weightlifting championships, medal ceremonies, and academy training moments.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let albums: GalleryAlbum[] = [];

  try {
    albums = await getCollection<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, {
      orderBy: 'createdAt',
      direction: 'desc',
    });
  } catch (error) {
    console.error('Gallery page fetch error:', error);
  }

  return (
    <main className="space-y-16 py-16 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider">
          <Camera size={14} className="text-[#D97706]" />
          <span>Competition Media</span>
        </div>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[#0F172A] tracking-tight">
          Official <span className="text-gold-gradient">Gallery</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Moments of grit, power, victory, and celebration across district and state weightlifting championships.
        </p>
      </section>

      {/* Album Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryAlbumsClient initialAlbums={albums} />
      </section>
    </main>
  );
}
