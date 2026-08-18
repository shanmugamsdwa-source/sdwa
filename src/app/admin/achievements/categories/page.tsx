'use client';

import { useState, useEffect, useCallback } from 'react';
import { AchievementCategory, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AchievementCategoriesAdminPage() {
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<AchievementCategory> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<AchievementCategory>(
        COLLECTIONS.ACHIEVEMENT_CATEGORIES,
        { orderBy: 'displayOrder' }
      );
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    try {
      setSaving(true);

      const payload = {
        name: editingCat.name || '',
        slug: (editingCat.name || '').toLowerCase().replace(/\s+/g, '-'),
        description: editingCat.description || '',
        displayOrder: editingCat.displayOrder ?? categories.length + 1,
        isActive: editingCat.isActive ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.ACHIEVEMENT_CATEGORIES, payload);
      } else if (editingCat.id) {
        await updateDocument(COLLECTIONS.ACHIEVEMENT_CATEGORIES, editingCat.id, payload);
      }

      setEditingCat(null);
      setIsNew(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This might affect existing achievements assigned to this category.')) return;
    try {
      await deleteDocument(COLLECTIONS.ACHIEVEMENT_CATEGORIES, id);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/achievements"
            className="p-2 bg-[#1e293b] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Achievement Categories</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage categories (e.g. Senior Men, Junior Women, Masters Men)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingCat({ displayOrder: categories.length + 1, isActive: true });
            setIsNew(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {editingCat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Add Category' : 'Edit Category'}
              </h2>
              <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  placeholder="e.g. Masters Men"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingCat.displayOrder ?? 1}
                  onChange={(e) => setEditingCat({ ...editingCat, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={editingCat.isActive ?? true}
                  onChange={(e) => setEditingCat({ ...editingCat, isActive: e.target.checked })}
                  className="rounded bg-[#0f172a] border-slate-600 text-[var(--color-accent)]"
                />
                <label htmlFor="isActiveCat" className="text-sm text-slate-300">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading categories...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.displayOrder}</td>
                  <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.isActive ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setIsNew(false);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
