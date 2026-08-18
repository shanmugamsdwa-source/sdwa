'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { url: string; caption?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 rounded-full border border-slate-700 transition"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation - Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white bg-slate-900/70 hover:bg-slate-900 rounded-full border border-slate-700 transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[70vh] flex items-center justify-center">
          <img
            src={currentImage.url}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded border border-slate-800 shadow-2xl"
          />
        </div>

        {/* Caption & Counter */}
        <div className="mt-4 text-center">
          {currentImage.caption && (
            <p className="text-slate-200 text-sm font-medium mb-1 max-w-2xl px-4">
              {currentImage.caption}
            </p>
          )}
          <p className="text-amber-500 font-mono text-xs tracking-wider">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % images.length);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white bg-slate-900/70 hover:bg-slate-900 rounded-full border border-slate-700 transition"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
