'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeightDivision, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WeightDivisionsAdminPage() {
  const [divisions, setDivisions] = useState<WeightDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<WeightDivision> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDivisions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<WeightDivision>(
        COLLECTIONS.WEIGHT_DIVISIONS,
        { orderBy: 'displayOrder' }
      );
      setDivisions(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load weight divisions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);

      const payload = {
        name: editingItem.name || '',
        slug: (editingItem.name || '').toLowerCase().replace(/\s+/g, '-'),
        displayOrder: editingItem.displayOrder ?? divisions.length + 1,
        isActive: editingItem.isActive ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.WEIGHT_DIVISIONS, payload);
      } else if (editingItem.id) {
        await updateDocument(COLLECTIONS.WEIGHT_DIVISIONS, editingItem.id, payload);
      }

      setEditingItem(null);
      setIsNew(false);
      fetchDivisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this division?')) return;
    try {
      await deleteDocument(COLLECTIONS.WEIGHT_DIVISIONS, id);
      fetchDivisions();
    } catch (err) {
      console.error(err);
      setError('Failed to delete division');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tournaments"
            className="p-2 bg-[#1e293b] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Weight Divisions</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage age and category groups (e.g. Senior &amp; Junior Men, Youth Girls)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem({ displayOrder: divisions.length + 1, isActive: true });
            setIsNew(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors"
        >
          <Plus size={18} />
          Add Division
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Add Division' : 'Edit Division'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Division Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Masters Men"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingItem.displayOrder ?? 1}
                  onChange={(e) => setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveDiv"
                  checked={editingItem.isActive ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="rounded bg-[#0f172a] border-slate-600 text-[var(--color-accent)]"
                />
                <label htmlFor="isActiveDiv" className="text-sm text-slate-300">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
                  {saving ? 'Saving...' : 'Save Division'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading divisions...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Division</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {divisions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{d.displayOrder}</td>
                  <td className="px-6 py-4 font-semibold text-white">{d.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{d.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        d.isActive ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(d);
                          setIsNew(false);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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
