'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryAlbum, COLLECTIONS } from '@/types';
import { getCollection } from '@/lib/firebase/firestore';
import { Images, Calendar, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/public/EmptyState';
import { formatDisplayDate } from '@/lib/utils/formatDate';

interface GalleryAlbumsClientProps {
  initialAlbums: GalleryAlbum[];
}

export default function GalleryAlbumsClient({ initialAlbums }: GalleryAlbumsClientProps) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums);

  useEffect(() => {
    async function syncAlbums() {
      try {
        const latest = await getCollection<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, {
          orderBy: 'createdAt',
          direction: 'desc',
        });
        if (latest) {
          setAlbums(latest);
        }
      } catch (err) {
        console.error('Client gallery album sync error:', err);
      }
    }

    syncAlbums();

    const handleStorage = () => syncAlbums();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  if (albums.length === 0) {
    return (
      <EmptyState
        type="gallery"
        title="Photo Albums Updating"
        message="Championship albums and ceremony photo archives will be published shortly."
        actionText="Return to Home"
        actionHref="/"
      />
    );
  }

  return (
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
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={album.coverImageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
  );
}
