'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GalleryAlbum, GalleryImage, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, Edit, Images, Save, X, Camera } from 'lucide-react';
import Link from 'next/link';

export default function GalleryAdminPage() {
  const { getToken } = useAuth();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<Partial<GalleryAlbum> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<GalleryAlbum>(
        COLLECTIONS.GALLERY_ALBUMS,
        { orderBy: 'createdAt', direction: 'desc' }
      );
      setAlbums(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load gallery albums');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;

    try {
      setSaving(true);

      const payload = {
        title: editingAlbum.title || '',
        slug: (editingAlbum.title || '').toLowerCase().replace(/\s+/g, '-'),
        description: editingAlbum.description || '',
        coverImageUrl: editingAlbum.coverImageUrl || '',
        coverImagePublicId: editingAlbum.coverImagePublicId || '',
        isPublished: editingAlbum.isPublished ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.GALLERY_ALBUMS, {
          ...payload,
          imageCount: 0,
        });
      } else if (editingAlbum.id) {
        await updateDocument(COLLECTIONS.GALLERY_ALBUMS, editingAlbum.id, payload);
      }

      setEditingAlbum(null);
      setIsNew(false);
      fetchAlbums();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album and all its images?')) return;
    try {
      // Find associated images to clean up
      const albumImages = await getCollection<GalleryImage>(COLLECTIONS.GALLERY_IMAGES, {
        where: [['albumId', '==', id]],
      });

      // Delete images from Firestore
      await Promise.all(albumImages.map((img) => deleteDocument(COLLECTIONS.GALLERY_IMAGES, img.id)));

      // Delete album document
      await deleteDocument(COLLECTIONS.GALLERY_ALBUMS, id);

      // Clean up Cloudinary images
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
          // Cloudinary deletion error is non-fatal
        }
      }

      fetchAlbums();
    } catch (err) {
      console.error(err);
      setError('Failed to delete album');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Gallery &amp; Albums</h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize championship events and ceremony photography into albums.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAlbum({ isPublished: true });
            setIsNew(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors"
        >
          <Plus size={18} />
          Create Album
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {editingAlbum && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Create New Album' : 'Edit Album Info'}
              </h2>
              <button onClick={() => setEditingAlbum(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={editingAlbum.title || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  placeholder="e.g. Salem District Championship 2026"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAlbum.description || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  placeholder="Album details or competition context..."
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <ImageUploader
                label="Album Cover Image"
                value={editingAlbum.coverImageUrl || ''}
                onChange={(url, publicId) =>
                  setEditingAlbum({
                    ...editingAlbum,
                    coverImageUrl: url,
                    coverImagePublicId: publicId,
                  })
                }
                folder="sdwa/gallery"
                aspectRatio="video"
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPubAlbum"
                  checked={editingAlbum.isPublished ?? true}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, isPublished: e.target.checked })}
                  className="rounded bg-[#0f172a] border-slate-600 text-[var(--color-accent)]"
                />
                <label htmlFor="isPubAlbum" className="text-sm text-slate-300 cursor-pointer">
                  Published on public site
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading albums...</div>
      ) : albums.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#1e293b] rounded-2xl border border-slate-800">
          No photo albums created yet. Click &quot;Create Album&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                  {album.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Images size={36} className="text-slate-600" />
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white font-semibold">
                    {album.imageCount || 0} photos
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-base leading-snug">{album.title}</h3>
                  {album.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{album.description}</p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <Link
                    href={`/admin/gallery/${album.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    <Camera size={15} className="text-slate-950" />
                    <span>Manage Photos ({album.imageCount || 0})</span>
                  </Link>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/gallery/${album.id}`}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-xl transition-colors"
                      title="Edit Album & Photos"
                      aria-label="Edit Album"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(album.id)}
                      className="p-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl transition-colors"
                      title="Delete Album"
                      aria-label="Delete Album"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
