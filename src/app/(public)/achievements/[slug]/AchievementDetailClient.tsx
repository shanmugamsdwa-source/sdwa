'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/public/Lightbox';
import { Camera, Maximize2 } from 'lucide-react';

interface AchievementDetailClientProps {
  images: { url: string; caption?: string }[];
}

export default function AchievementDetailClient({ images }: AchievementDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-amber-600" />
        <h2 className="font-oswald text-2xl font-bold uppercase text-[#0F172A]">
          Ceremony &amp; Podium Gallery
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 shadow-sm bg-slate-100 hover:shadow-md transition"
          >
            <Image
              src={img.url}
              alt={img.caption || `Podium Photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 bg-white/90 rounded-full text-slate-900 shadow">
                <Maximize2 className="w-5 h-5" />
              </span>
            </div>
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs font-medium truncate">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
}
