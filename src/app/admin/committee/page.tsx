'use client';

import { useState, useEffect, useCallback } from 'react';
import { CommitteeMember, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  batchUpdateOrder,
} from '@/lib/firebase/firestore';
import { INITIAL_OFFICIAL_COMMITTEE } from '@/lib/constants/committee';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  Plus,
  Trash2,
  Edit,
  MoveUp,
  MoveDown,
  Save,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  Users,
} from 'lucide-react';

export default function CommitteeAdminPage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<CommitteeMember> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<CommitteeMember>(
        COLLECTIONS.COMMITTEE_MEMBERS,
        { orderBy: 'displayOrder' }
      );
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load committee members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
    if (!editingMember) return;

    try {
      setSaving(true);

      const designationValue = (
        editingMember.designation ||
        editingMember.position ||
        ''
      ).trim();

      const payload = {
        name: editingMember.name?.trim() || '',
        designation: designationValue,
        position: designationValue, // for backward compatibility
        photoUrl: editingMember.photoUrl || '',
        photoPublicId: editingMember.photoPublicId || '',
        description: editingMember.description?.trim() || '',
        displayOrder: editingMember.displayOrder ?? (members.length + 1),
        isActive: editingMember.isActive ?? true,
        isPublished: editingMember.isActive ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.COMMITTEE_MEMBERS, payload);
      } else if (editingMember.id) {
        await updateDocument(COLLECTIONS.COMMITTEE_MEMBERS, editingMember.id, payload);
      }

      setEditingMember(null);
      setIsNew(false);
      showNotification(isNew ? 'Committee member created' : 'Committee member updated');
      fetchMembers();
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Save error', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the committee?`)) return;
    try {
      await deleteDocument(COLLECTIONS.COMMITTEE_MEMBERS, id);
      showNotification('Committee member deleted');
      fetchMembers();
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete member', true);
    }
  };

  const toggleStatus = async (member: CommitteeMember) => {
    try {
      await updateDocument(COLLECTIONS.COMMITTEE_MEMBERS, member.id, {
        isActive: !member.isActive,
        isPublished: !member.isActive,
      });
      showNotification(`Member ${!member.isActive ? 'activated' : 'deactivated'}`);
      fetchMembers();
    } catch (err) {
      showNotification('Failed to update status', true);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const newMembers = [...members];
    const [moved] = newMembers.splice(index, 1);
    newMembers.splice(targetIndex, 0, moved);

    const orders = newMembers.map((m, idx) => ({ id: m.id, displayOrder: idx + 1 }));
    setMembers(newMembers);

    try {
      await batchUpdateOrder(COLLECTIONS.COMMITTEE_MEMBERS, orders);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        'This will populate the database with the official 11 SDWA Executive Committee members. Continue?'
      )
    )
      return;

    try {
      setSeeding(true);

      for (const item of INITIAL_OFFICIAL_COMMITTEE) {
        await createDocument(COLLECTIONS.COMMITTEE_MEMBERS, {
          ...item,
          position: item.designation,
          isPublished: true,
          isActive: true,
        });
      }

      showNotification('Official SDWA Committee members successfully loaded!');
      fetchMembers();
    } catch (err) {
      showNotification('Error seeding committee', true);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Committee</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage association office bearers and executive members displayed on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {members.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <RotateCcw size={15} />
              {seeding ? 'Loading...' : 'Load Official 11 Members'}
            </button>
          )}
          <button
            onClick={() => {
              setEditingMember({
                displayOrder: members.length + 1,
                isActive: true,
                isPublished: true,
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-light)] transition-colors shadow-lg"
          >
            <Plus size={18} />
            Add Member
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

      {/* Edit/Create Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? 'Add Committee Member' : 'Edit Committee Member'}
              </h2>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    placeholder="e.g. L.R. Marconi"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.designation || editingMember.position || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        designation: e.target.value,
                        position: e.target.value,
                      })
                    }
                    placeholder="e.g. President, Secretary, Treasurer, Vice-President, Joint Secretary, Executive Member"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUploader
                    label="Official Portrait / Profile Image"
                    value={editingMember.photoUrl || ''}
                    onChange={(url, publicId) =>
                      setEditingMember({
                        ...editingMember,
                        photoUrl: url,
                        photoPublicId: publicId,
                      })
                    }
                    folder="sdwa/committee"
                    aspectRatio="square"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description / Bio (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={editingMember.description || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, description: e.target.value })
                    }
                    placeholder="Brief achievements or role notes..."
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingMember.displayOrder ?? (members.length + 1)}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingMember.isActive ?? true}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        isActive: e.target.checked,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded bg-[#0F172A] border-slate-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-300 cursor-pointer">
                    Active / Published
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
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
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Table */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading committee...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-400">
              No committee members added yet. Click &quot;Add Member&quot; or &quot;Load Official 11 Members&quot;.
            </p>
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              <Users size={14} />
              Load 11 Official SDWA Members
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F172A] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-20">Order</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
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
                        disabled={index === members.length - 1}
                        className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                        title="Move down"
                      >
                        <MoveDown size={16} />
                      </button>
                      <span className="ml-1.5 font-mono text-xs text-slate-400 font-bold">
                        {String(member.displayOrder || index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.photoUrl}
                          alt={`Portrait of ${member.name}`}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xs text-[#FCD34D] font-mono">
                          {(member.name || '')
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0].toUpperCase())
                            .join('')}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white block">{member.name}</span>
                        {member.description && (
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {member.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#FCD34D] text-xs uppercase tracking-wider">
                      {member.designation || member.position}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(member)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        member.isActive
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                          : 'bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-700'
                      }`}
                      title="Click to toggle status"
                    >
                      {member.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{member.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setIsNew(false);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Edit member"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete member"
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
