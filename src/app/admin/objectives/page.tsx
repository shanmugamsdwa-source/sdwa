'use client';

import { useState, useEffect, useCallback } from 'react';
import { AssociationObjective, ObjectiveCategory, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  batchUpdateOrder,
} from '@/lib/firebase/firestore';
import { INITIAL_OFFICIAL_OBJECTIVES } from '@/lib/constants/objectives';
import {
  Plus,
  Trash2,
  Edit,
  MoveUp,
  MoveDown,
  Save,
  X,
  Target,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

const CATEGORY_META: Record<
  ObjectiveCategory,
  { label: string; badgeColor: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  core_objective: {
    label: 'Core Objective (01-06)',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Target,
  },
  sporting_objective: {
    label: 'Sporting Objective',
    badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: Trophy,
  },
  commitment: {
    label: 'Social Commitment',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: ShieldCheck,
  },
};

export default function ObjectivesAdminPage() {
  const [objectives, setObjectives] = useState<AssociationObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | ObjectiveCategory>('all');
  const [editingItem, setEditingItem] = useState<Partial<AssociationObjective> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchObjectives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<AssociationObjective>(
        COLLECTIONS.ASSOCIATION_OBJECTIVES,
        { orderBy: 'displayOrder' }
      );
      setObjectives(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load association objectives');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const showNotification = (msg: string, isError: boolean = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);

      const payload = {
        title: editingItem.title?.trim() || '',
        shortTitle: editingItem.shortTitle?.trim() || '',
        description: editingItem.description?.trim() || '',
        category: editingItem.category || 'core_objective',
        displayOrder: editingItem.displayOrder ?? (objectives.length + 1),
        isPublished: editingItem.isPublished ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.ASSOCIATION_OBJECTIVES, payload);
      } else if (editingItem.id) {
        await updateDocument(COLLECTIONS.ASSOCIATION_OBJECTIVES, editingItem.id, payload);
      }

      setEditingItem(null);
      setIsNew(false);
      showNotification(isNew ? 'Objective created' : 'Objective updated');
      fetchObjectives();
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Save error', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteDocument(COLLECTIONS.ASSOCIATION_OBJECTIVES, id);
      showNotification('Objective deleted');
      fetchObjectives();
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete objective', true);
    }
  };

  const togglePublishStatus = async (item: AssociationObjective) => {
    try {
      await updateDocument(COLLECTIONS.ASSOCIATION_OBJECTIVES, item.id, {
        isPublished: !item.isPublished,
      });
      showNotification(`Objective ${!item.isPublished ? 'published' : 'hidden'}`);
      fetchObjectives();
    } catch (err) {
      showNotification('Failed to update published status', true);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const filteredList = filteredObjectives;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredList.length) return;

    const newFiltered = [...filteredList];
    const [moved] = newFiltered.splice(index, 1);
    newFiltered.splice(targetIndex, 0, moved);

    const orders = newFiltered.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    // Optimistic UI update
    setObjectives((prev) =>
      prev.map((item) => {
        const matching = orders.find((o) => o.id === item.id);
        return matching ? { ...item, displayOrder: matching.displayOrder } : item;
      })
    );

    try {
      await batchUpdateOrder(COLLECTIONS.ASSOCIATION_OBJECTIVES, orders);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        'This will populate the database with the official 11 SDWA Objectives, Sporting Objectives, and Commitments. Continue?'
      )
    )
      return;

    try {
      setSeeding(true);

      for (const item of INITIAL_OFFICIAL_OBJECTIVES) {
        await createDocument(COLLECTIONS.ASSOCIATION_OBJECTIVES, item as unknown as Record<string, unknown>);
      }

      showNotification('Official SDWA Objectives successfully populated!');
      fetchObjectives();
    } catch (err) {
      showNotification('Error seeding objectives', true);
    } finally {
      setSeeding(false);
    }
  };

  const filteredObjectives = objectives.filter((item) => {
    if (selectedTab === 'all') return true;
    return item.category === selectedTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Association Objectives &amp; Commitment</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage official SDWA objectives, sporting focus, and organizational commitments displayed on the About page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {objectives.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <RotateCcw size={15} />
              {seeding ? 'Seeding...' : 'Load Official Defaults'}
            </button>
          )}
          <button
            onClick={() => {
              setEditingItem({
                category: selectedTab !== 'all' ? selectedTab : 'core_objective',
                displayOrder: filteredObjectives.length + 1,
                isPublished: true,
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors shadow-lg"
          >
            <Plus size={18} />
            Add Objective
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'all', label: `All Items (${objectives.length})` },
          {
            key: 'core_objective',
            label: `Core Objectives (${objectives.filter((o) => o.category === 'core_objective').length})`,
          },
          {
            key: 'sporting_objective',
            label: `Sporting Objectives (${objectives.filter((o) => o.category === 'sporting_objective').length})`,
          },
          {
            key: 'commitment',
            label: `Commitments (${objectives.filter((o) => o.category === 'commitment').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === tab.key
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Add Association Objective' : 'Edit Association Objective'}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={editingItem.category || 'core_objective'}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value as ObjectiveCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                  <option value="core_objective">Core Objective (Numbered 01-06)</option>
                  <option value="sporting_objective">Sporting Objective</option>
                  <option value="commitment">Our Commitment (Non-Profit / Non-Political)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  placeholder="e.g. Promoting Human Potential Through Weightlifting"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Short Header / Label (Optional uppercase)
                </label>
                <input
                  type="text"
                  value={editingItem.shortTitle || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, shortTitle: e.target.value })
                  }
                  placeholder="e.g. PROMOTING HUMAN POTENTIAL"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Detailed Official Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Full official text according to association principles..."
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.displayOrder ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={editingItem.isPublished ?? true}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded bg-[#0F172A] border-slate-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <label htmlFor="isPublished" className="text-sm text-slate-300 cursor-pointer">
                    Published (Visible)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-light)] disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Objective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Objectives Table */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading objectives...</div>
        ) : filteredObjectives.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-400">
              No objectives found for this view. Click &quot;Add Objective&quot; or &quot;Load Official Defaults&quot;.
            </p>
            {objectives.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                <RotateCcw size={14} />
                Load 11 Official SDWA Objectives
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F172A] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-20">Order</th>
                <th className="px-6 py-4">Title &amp; Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredObjectives.map((item, index) => {
                const meta = CATEGORY_META[item.category] || CATEGORY_META.core_objective;
                const Icon = meta.icon;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <MoveUp size={16} />
                        </button>
                        <button
                          onClick={() => moveOrder(index, 'down')}
                          disabled={index === filteredObjectives.length - 1}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <MoveDown size={16} />
                        </button>
                        <span className="ml-1.5 font-mono text-xs text-slate-400 font-bold">
                          {String(item.displayOrder || index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="space-y-1">
                        {item.shortTitle && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FCD34D] block">
                            {item.shortTitle}
                          </span>
                        )}
                        <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badgeColor}`}
                      >
                        <Icon size={12} />
                        <span>{meta.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublishStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          item.isPublished
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                            : 'bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-700'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {item.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.isPublished ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsNew(false);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
