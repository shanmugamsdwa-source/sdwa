'use client';

import { useState, useEffect, useCallback } from 'react';
import { TournamentCategory, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TournamentCategoriesPage() {
  const [categories, setCategories] = useState<TournamentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TournamentCategory> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<TournamentCategory>(
        COLLECTIONS.TOURNAMENT_CATEGORIES,
        { orderBy: 'displayOrder' }
      );
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tournament categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      setSaving(true);

      const payload = {
        name: editing.name || '',
        slug: editing.name?.toLowerCase().replace(/\s+/g, '-') || '',
        displayOrder: editing.displayOrder || categories.length + 1,
        isActive: editing.isActive ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.TOURNAMENT_CATEGORIES, payload);
      } else if (editing.id) {
        await updateDocument(COLLECTIONS.TOURNAMENT_CATEGORIES, editing.id, payload);
      }

      setEditing(null);
      setIsNew(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament category?')) return;
    try {
      await deleteDocument(COLLECTIONS.TOURNAMENT_CATEGORIES, id);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tournaments"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Tournament Categories</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage competition categories for tournaments and championships.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditing({ displayOrder: categories.length + 1, isActive: true });
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

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Add Tournament Category' : 'Edit Tournament Category'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. District Championship, State Trials"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editing.isActive ?? true}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="rounded bg-[#0F172A] border-slate-600 text-[var(--color-accent)]"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No tournament categories yet. Click &quot;Add Category&quot; to create one.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F172A] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(cat);
                          setIsNew(false);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
