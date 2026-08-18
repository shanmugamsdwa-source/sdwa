'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeightClass, WeightDivision, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WeightClassesAdminPage() {
  const [classes, setClasses] = useState<WeightClass[]>([]);
  const [divisions, setDivisions] = useState<WeightDivision[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<WeightClass> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const divs = await getCollection<WeightDivision>(
        COLLECTIONS.WEIGHT_DIVISIONS,
        { orderBy: 'displayOrder' }
      );
      setDivisions(divs);

      const options: Parameters<typeof getCollection>[1] = {
        orderBy: 'displayOrder',
      };
      if (selectedDivision !== 'ALL') {
        options.where = [['divisionId', '==', selectedDivision]];
      }

      const wcs = await getCollection<WeightClass>(
        COLLECTIONS.WEIGHT_CLASSES,
        options
      );
      setClasses(wcs);
    } catch (err) {
      console.error(err);
      setError('Failed to load weight classes');
    } finally {
      setLoading(false);
    }
  }, [selectedDivision]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);

      const payload = {
        divisionId: editingItem.divisionId || (divisions[0]?.id ?? ''),
        value: editingItem.value ?? null,
        minimumWeight: editingItem.minimumWeight,
        displayValue: editingItem.displayValue || '',
        displayOrder: editingItem.displayOrder ?? classes.length + 1,
        isActive: editingItem.isActive ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.WEIGHT_CLASSES, payload);
      } else if (editingItem.id) {
        await updateDocument(COLLECTIONS.WEIGHT_CLASSES, editingItem.id, payload);
      }

      setEditingItem(null);
      setIsNew(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this weight class?')) return;
    try {
      await deleteDocument(COLLECTIONS.WEIGHT_CLASSES, id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete weight class');
    }
  };

  const getDivisionName = (id: string) =>
    divisions.find((d) => d.id === id)?.name || id || '—';

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
            <h1 className="text-2xl font-bold text-white">Weight Classes</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage exact weight categories (e.g. 55 kg, 61 kg, +109 kg)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem({
              divisionId: divisions[0]?.id || '',
              displayOrder: classes.length + 1,
              isActive: true,
            });
            setIsNew(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors"
        >
          <Plus size={18} />
          Add Weight Class
        </button>
      </div>

      {/* Filter by Division */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedDivision('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedDivision === 'ALL'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[#1e293b] text-slate-400 hover:text-white'
          }`}
        >
          All Divisions
        </button>
        {divisions.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDivision(d.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedDivision === d.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            {d.name}
          </button>
        ))}
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
                {isNew ? 'Add Weight Class' : 'Edit Weight Class'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Division *</label>
                <select
                  value={editingItem.divisionId || (divisions[0]?.id ?? '')}
                  onChange={(e) => setEditingItem({ ...editingItem, divisionId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Display Value *</label>
                <input
                  type="text"
                  required
                  value={editingItem.displayValue || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, displayValue: e.target.value })}
                  placeholder="e.g. 60 kg or +110 kg"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Numeric Value (leave blank for plus-classes)
                </label>
                <input
                  type="number"
                  value={editingItem.value ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      value: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="e.g. 60"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Minimum Weight (for + classes)
                </label>
                <input
                  type="number"
                  value={editingItem.minimumWeight ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      minimumWeight: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g. 110"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
                />
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
                  {saving ? 'Saving...' : 'Save Weight Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading weight classes...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Weight Class</th>
                <th className="px-6 py-4">Division</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {classes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{c.displayOrder}</td>
                  <td className="px-6 py-4 font-bold text-white font-mono">{c.displayValue}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{getDivisionName(c.divisionId)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(c);
                          setIsNew(false);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
