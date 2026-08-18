'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GalleryAlbum, GalleryImage, COLLECTIONS } from '@/types';
import {
  getDocument,
  getCollection,
  updateDocument,
  createDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import MultiImageUploader, { UploadedMediaItem } from '@/components/admin/MultiImageUploader';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [images, setImages] = useState<UploadedMediaItem[]>([]);

  const fetchAlbumData = useCallback(async () => {
    try {
      setLoading(true);

      const [albumData, imgData] = await Promise.all([
        getDocument<GalleryAlbum>(COLLECTIONS.GALLERY_ALBUMS, id),
        getCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES, {
          where: [['albumId', '==', id]],
          orderBy: 'displayOrder',
        }),
      ]);

      if (albumData) {
        setAlbum(albumData);
      }
      setImages(
        imgData.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: img.publicId,
          caption: img.caption,
          displayOrder: img.displayOrder,
        }))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to load album data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!album) return;

    try {
      setSaving(true);
      setError(null);

      // 1. Update album metadata
      await updateDocument(COLLECTIONS.GALLERY_ALBUMS, id, {
        title: album.title,
        description: album.description,
        coverImageUrl: album.coverImageUrl || (images[0]?.url || ''),
        coverImagePublicId: album.coverImagePublicId || (images[0]?.publicId || ''),
        imageCount: images.length,
        isPublished: album.isPublished,
      });

      // 2. Fetch existing images to compute diff
      const existingImages = await getCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES, {
        where: [['albumId', '==', id]],
      });

      const currentImageIds = new Set(images.map((img) => img.id).filter(Boolean));
      const imagesToDelete = existingImages.filter((img) => !currentImageIds.has(img.id));

      // Delete removed images
      await Promise.all(imagesToDelete.map((img) => deleteDocument(COLLECTIONS.GALLERY_IMAGES, img.id)));

      // Clean up Cloudinary for deleted images
      const deletedPublicIds = imagesToDelete.map((img) => img.publicId).filter(Boolean);
      if (deletedPublicIds.length > 0) {
        try {
          const token = await getToken();
          await fetch('/api/admin/upload/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ publicIds: deletedPublicIds }),
          });
        } catch {
          // Non-fatal
        }
      }

      // Upsert current images
      await Promise.all(
        images.map(async (img, idx) => {
          const payload = {
            albumId: id,
            url: img.url,
            publicId: img.publicId || '',
            caption: img.caption || '',
            displayOrder: idx + 1,
          };

          if (img.id) {
            await updateDocument(COLLECTIONS.GALLERY_IMAGES, img.id, payload);
          } else {
            await createDocument(COLLECTIONS.GALLERY_IMAGES, payload);
          }
        })
      );

      router.push('/admin/gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!confirm('Are you sure you want to delete this album and all its images?')) return;
    try {
      const albumImages = await getCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES, {
        where: [['albumId', '==', id]],
      });

      await Promise.all(albumImages.map((img) => deleteDocument(COLLECTIONS.GALLERY_IMAGES, img.id)));
      await deleteDocument(COLLECTIONS.GALLERY_ALBUMS, id);

      const publicIds = albumImages.map((img) => img.publicId).filter(Boolean);
      if (publicIds.length > 0) {
        try {
          const token = await getToken();
          await fetch('/api/admin/upload/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ publicIds }),
          });
        } catch {
          // Non-fatal
        }
      }

      router.push('/admin/gallery');
    } catch (err) {
      console.error(err);
      setError('Failed to delete album');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <Loader2 className="animate-spin mr-2" /> Loading album photos...
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-12 text-center text-slate-400">
        Album not found.{' '}
        <Link href="/admin/gallery" className="text-[var(--color-accent)] underline">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/gallery"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Album Photos</h1>
            <p className="text-slate-400 text-sm mt-1">{album.title}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeleteAlbum}
          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Trash2 size={16} /> Delete Album
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Album Details */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Album Information</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Album Title *
            </label>
            <input
              type="text"
              required
              value={album.title || ''}
              onChange={(e) => setAlbum({ ...album, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={album.description || ''}
              onChange={(e) => setAlbum({ ...album, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <ImageUploader
            label="Album Cover Image"
            value={album.coverImageUrl || ''}
            onChange={(url, publicId) =>
              setAlbum({ ...album, coverImageUrl: url, coverImagePublicId: publicId })
            }
            folder="sdwa/gallery"
            aspectRatio="video"
          />
        </div>

        {/* Batch Photos */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Album Photographs</h2>
          <MultiImageUploader
            images={images}
            onChange={setImages}
            folder="sdwa/gallery"
            label="Upload Competition Photos"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={album.isPublished}
            onChange={(e) => setAlbum({ ...album, isPublished: e.target.checked })}
            className="rounded bg-slate-800 border-slate-600 text-[var(--color-accent)]"
          />
          <label htmlFor="isPublished" className="text-sm text-slate-300 cursor-pointer">
            Published (visible on website gallery)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-sm font-bold shadow-md disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
