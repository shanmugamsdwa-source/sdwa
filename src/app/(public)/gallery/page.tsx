import Link from 'next/link';
import Image from 'next/image';
import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, GalleryAlbum } from '@/types';
import { Images, Camera, Calendar, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/public/EmptyState';
import { formatDisplayDate } from '@/lib/utils/formatDate';

export const metadata = {
  title: 'Competition & Championship Photo Gallery | SDWA',
  description:
    'Official photography archive of Salem District Weightlifting championships, medal ceremonies, and academy training moments.',
};

export const revalidate = 60;

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
        {albums.length === 0 ? (
          <EmptyState
            type="gallery"
            title="Photo Albums Updating"
            message="Championship albums and ceremony photo archives will be published shortly."
            actionText="Return to Home"
            actionHref="/"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug || album.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-amber-400 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {album.coverImageUrl ? (
                      <Image
                        src={album.coverImageUrl}
                        alt={album.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Images size={44} className="text-slate-400" />
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-xl text-xs font-semibold text-white">
                      {album.imageCount || 0} photos
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-oswald text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors leading-snug">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-slate-100 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{formatDisplayDate(album.date, false)}</span>
                  </span>
                  <span className="text-[#92400E] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Album</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
