'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/types';
import Lightbox from '@/components/public/Lightbox';
import EmptyState from '@/components/public/EmptyState';
import { Maximize2 } from 'lucide-react';

interface AlbumPhotosClientProps {
  photos: GalleryImage[];
  albumTitle: string;
}

export default function AlbumPhotosClient({ photos, albumTitle }: AlbumPhotosClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <EmptyState
        type="gallery"
        title="No Photos in Album"
        message="Photographs for this championship event will be uploaded shortly by the media team."
        actionText="Back to Albums"
        actionHref="/gallery"
      />
    );
  }

  const lightboxImages = photos.map((p) => ({
    url: p.url,
    caption: p.caption || albumTitle,
  }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(idx)}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={photo.url}
              alt={photo.caption || `${albumTitle} Photo ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2.5 bg-white/90 rounded-full text-slate-900 shadow">
                <Maximize2 className="w-5 h-5" />
              </span>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </>
  );
}
