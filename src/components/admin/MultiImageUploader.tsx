'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Loader2, Plus } from 'lucide-react';

export interface UploadedMediaItem {
  id?: string;
  url: string;
  publicId?: string;
  caption?: string;
  displayOrder?: number;
}

interface MultiImageUploaderProps {
  images: UploadedMediaItem[];
  onChange: (images: UploadedMediaItem[]) => void;
  folder?: string;
  label?: string;
}

export default function MultiImageUploader({
  images,
  onChange,
  folder = 'sdwa/gallery',
  label = 'Album Photos',
}: MultiImageUploaderProps) {
  const { getToken } = useAuth();
  const [uploadingCount, setUploadingCount] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploadingCount(acceptedFiles.length);

      try {
        const token = await getToken();
        const uploadPromises = acceptedFiles.map(async (file, idx) => {
          return new Promise<UploadedMediaItem>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
              try {
                const res = await fetch('/api/admin/upload', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    file: reader.result as string,
                    folder,
                  }),
                });

                if (!res.ok) throw new Error('Failed to upload image');
                const data = await res.json();
                resolve({
                  url: data.secureUrl || data.url,
                  publicId: data.publicId,
                  caption: file.name.replace(/\.[^/.]+$/, ''),
                  displayOrder: images.length + idx + 1,
                });
              } catch (e) {
                reject(e);
              }
            };
          });
        });

        const newItems = await Promise.all(uploadPromises);
        onChange([...images, ...newItems]);
      } catch (err) {
        console.error('Batch upload error:', err);
      } finally {
        setUploadingCount(0);
      }
    },
    [folder, getToken, images, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
  });

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} ({images.length} uploaded)
        </label>
      )}

      {/* Grid of existing images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col"
          >
            <div className="relative aspect-square w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.caption || 'Photo'}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Add caption..."
              value={item.caption || ''}
              onChange={(e) => handleCaptionChange(idx, e.target.value)}
              className="p-1.5 bg-[#0F172A] border-t border-slate-800 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none"
            />
          </div>
        ))}

        {/* Dropzone tile */}
        <div
          {...getRootProps()}
          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
              : 'border-slate-700 hover:border-slate-500 bg-[#0F172A]'
          }`}
        >
          <input {...getInputProps()} />
          {uploadingCount > 0 ? (
            <div className="space-y-1">
              <Loader2 size={20} className="animate-spin text-[#D4AF37] mx-auto" />
              <p className="text-[10px] text-slate-400">Uploading {uploadingCount} files...</p>
            </div>
          ) : (
            <div className="space-y-1">
              <Plus size={20} className="text-slate-400 mx-auto" />
              <p className="text-xs text-slate-300 font-semibold">Add Photos</p>
              <p className="text-[10px] text-slate-500">Drag or click</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
