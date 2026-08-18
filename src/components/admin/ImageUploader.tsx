'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'sdwa/general',
  label = 'Upload Image',
  aspectRatio = 'square',
}: ImageUploaderProps) {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validation: Size max 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      try {
        setUploading(true);
        setError(null);

        // Convert file to base64 data URI
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          try {
            const base64data = reader.result as string;
            const token = await getToken();

            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                file: base64data,
                folder,
              }),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || `Upload failed (Status ${res.status})`);
            }

            const result = await res.json();
            onChange(result.secureUrl || result.url, result.publicId);
            setUploading(false);
          } catch (uploadErr: any) {
            console.error('Image upload failed:', uploadErr);
            setError(uploadErr?.message || 'Upload failed');
            setUploading(false);
          }
        };
      } catch (err: any) {
        console.error('Image upload failed:', err);
        setError(err?.message || 'Upload failed');
        setUploading(false);
      }
    },
    [folder, getToken, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/x-icon': ['.ico'],
      'image/vnd.microsoft.icon': ['.ico'],
      'image/svg+xml': ['.svg'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '');
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className={`relative ${getAspectClass()} max-w-xs rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1 shadow-lg transition-transform hover:scale-105"
            >
              <X size={16} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
              : 'border-slate-700 hover:border-slate-500 bg-[#0F172A]'
          } ${uploading ? 'opacity-50 cursor-wait' : ''}`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Loader2 size={28} className="animate-spin text-[#D4AF37]" />
              <p className="text-xs font-semibold text-slate-300">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Upload size={18} />
              </div>
              <p className="text-xs font-medium text-slate-300">
                <span className="text-[#D4AF37] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-500">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
