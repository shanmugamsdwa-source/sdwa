'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AffiliatedCentre, INITIAL_CENTRE_TYPES, COLLECTIONS } from '@/types';
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/firestore';
import { VERIFIED_CENTRES_SEED_DATA } from '@/lib/constants/centres';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Building2,
  Database,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function AffiliatedCentresAdminPage() {
  const [centres, setCentres] = useState<AffiliatedCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<AffiliatedCentre> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<AffiliatedCentre | null>(null);
  const [customTypeInput, setCustomTypeInput] = useState<string>('');
  const [showCustomType, setShowCustomType] = useState<boolean>(false);

  // Fetch all centres
  const fetchCentres = useCallback(async () => {
    try {
      setLoading(true);
      const options: Parameters<typeof getCollection>[1] = {
        orderBy: 'displayOrder',
      };
      if (selectedType !== 'ALL') {
        options.where = [['centreType', '==', selectedType]];
      }

      const data = await getCollection<AffiliatedCentre>(
        COLLECTIONS.AFFILIATED_CENTRES,
        options
      );
      setCentres(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load affiliated centres');
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchCentres();
  }, [fetchCentres]);

  // Dynamic list of all available centre types
  const availableTypes = useMemo(() => {
    const set = new Set<string>(INITIAL_CENTRE_TYPES);
    centres.forEach((c) => {
      if (c.centreType) set.add(c.centreType);
      if (c.organizationType) set.add(c.organizationType);
    });
    return Array.from(set);
  }, [centres]);

  // Duplicate name detection helper
  const duplicateWarning = useMemo(() => {
    if (!editingItem || !editingItem.name || !editingItem.name.trim()) return null;
    const cleanName = editingItem.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    const found = centres.find((c) => {
      if (!isNew && c.id === editingItem.id) return false;
      const cClean = c.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      // Exact match or high similarity check
      return cClean === cleanName || (cleanName.length > 5 && (cClean.includes(cleanName) || cleanName.includes(cClean)));
    });

    if (found) {
      return `A similar affiliated centre ("${found.name}") already exists. Please verify before saving.`;
    }
    return null;
  }, [editingItem, centres, isNew]);

  // Save handler (Create / Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name || !editingItem.name.trim()) {
      setError('Centre Name is required');
      return;
    }

    const typeToSave = showCustomType && customTypeInput.trim()
      ? customTypeInput.trim()
      : editingItem.centreType || 'Gym';

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const payload: Partial<AffiliatedCentre> = {
        name: editingItem.name.trim(),
        slug: (editingItem.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        centreType: typeToSave,
        contactPerson: editingItem.contactPerson?.trim() || '',
        phone: editingItem.phone?.trim() || '',
        secondaryPhone: editingItem.secondaryPhone?.trim() || '',
        address: editingItem.address?.trim() || '',
        googleMapsUrl: editingItem.googleMapsUrl?.trim() || '',
        imageUrl: editingItem.imageUrl || editingItem.logoUrl || '',
        imagePublicId: editingItem.imagePublicId || '',
        description: editingItem.description?.trim() || '',
        displayOrder: editingItem.displayOrder ?? (centres.length + 1),
        isPublished: editingItem.isPublished ?? true,

        // Backward compatibility
        coachName: editingItem.contactPerson?.trim() || '',
        logoUrl: editingItem.imageUrl || editingItem.logoUrl || '',
        organizationType: typeToSave,
        isActive: editingItem.isPublished ?? true,
      };

      if (isNew) {
        await createDocument(COLLECTIONS.AFFILIATED_CENTRES, payload);
      } else if (editingItem.id) {
        await updateDocument(COLLECTIONS.AFFILIATED_CENTRES, editingItem.id, payload);
      }

      setSuccessMessage(`Affiliated centre "${payload.name}" saved successfully.`);
      setEditingItem(null);
      setIsNew(false);
      setShowCustomType(false);
      setCustomTypeInput('');
      fetchCentres();
    } catch (err: any) {
      setError(err?.message || 'Error saving affiliated centre');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (centre: AffiliatedCentre) => {
    try {
      const newStatus = !(centre.isPublished !== false && centre.isActive !== false);

      await updateDocument(COLLECTIONS.AFFILIATED_CENTRES, centre.id, {
        isPublished: newStatus,
        isActive: newStatus,
      });

      setCentres((prev) =>
        prev.map((c) => (c.id === centre.id ? { ...c, isPublished: newStatus, isActive: newStatus } : c))
      );
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
      setError('Failed to update published status');
    }
  };

  // Delete Action with Modal Confirmation
  const confirmDelete = async () => {
    if (!deleteConfirmTarget) return;

    try {
      await deleteDocument(COLLECTIONS.AFFILIATED_CENTRES, deleteConfirmTarget.id);
      setSuccessMessage(`Deleted "${deleteConfirmTarget.name}".`);
      setDeleteConfirmTarget(null);
      fetchCentres();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete affiliated centre');
      setDeleteConfirmTarget(null);
    }
  };

  // Seed 15 Verified Initial Centres
  const handleSeedVerified = async () => {
    if (!confirm('This will seed/verify the 15 verified SDWA affiliated centres. Proceed?')) return;

    try {
      setSeeding(true);
      setError(null);

      const existing = await getCollection<AffiliatedCentre>(COLLECTIONS.AFFILIATED_CENTRES);
      const existingMap = new Map<string, AffiliatedCentre>();
      existing.forEach((c) => {
        existingMap.set(c.name.toLowerCase().trim(), c);
        if (c.name.toLowerCase().includes('powai')) {
          existingMap.set('paavai engineering college', c);
        }
      });

      let created = 0;
      let updated = 0;

      for (const item of VERIFIED_CENTRES_SEED_DATA) {
        const key = item.name.toLowerCase().trim();
        const slug = item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const existingRecord = existingMap.get(key);

        const payload = {
          name: item.name,
          slug,
          centreType: item.centreType,
          contactPerson: item.contactPerson,
          phone: item.phone,
          displayOrder: item.displayOrder,
          isPublished: true,
          coachName: item.contactPerson,
          organizationType: item.centreType,
          isActive: true,
        };

        if (existingRecord) {
          await updateDocument(COLLECTIONS.AFFILIATED_CENTRES, existingRecord.id, payload);
          updated++;
        } else {
          await createDocument(COLLECTIONS.AFFILIATED_CENTRES, payload);
          created++;
        }
      }

      setSuccessMessage(`Seeded ${created} new centres, updated ${updated} centres.`);
      fetchCentres();
    } catch (err: any) {
      setError(err?.message || 'Error seeding verified centres');
    } finally {
      setSeeding(false);
    }
  };

  // Filtered list for search
  const filteredCentres = useMemo(() => {
    return centres.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (c.name || '').toLowerCase();
      const contact = (c.contactPerson || c.coachName || '').toLowerCase();
      const type = (c.centreType || c.organizationType || '').toLowerCase();
      const phone = (c.phone || '');
      return name.includes(q) || contact.includes(q) || type.includes(q) || phone.includes(q);
    });
  }, [centres, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliated Centres</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage gyms, weightlifting academies, sports academies, fitness centres, and educational institutions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedVerified}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl transition border border-slate-700 disabled:opacity-50"
            title="Seed the 15 exact verified centres from association records"
          >
            <Database size={15} />
            <span>{seeding ? 'Seeding...' : 'Seed 15 Verified Centres'}</span>
          </button>

          <button
            onClick={() => {
              setEditingItem({
                name: '',
                centreType: 'Weightlifting Academy',
                contactPerson: '',
                phone: '',
                secondaryPhone: '',
                address: '',
                googleMapsUrl: '',
                imageUrl: '',
                description: '',
                displayOrder: centres.length + 1,
                isPublished: true,
              });
              setIsNew(true);
              setShowCustomType(false);
              setCustomTypeInput('');
              setError(null);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--color-accent-light)] transition shadow-lg"
          >
            <Plus size={16} />
            <span>Add Centre</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="p-1 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-[#1e293b] p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by centre, contact person, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'bg-[#0f172a] text-slate-300 border border-slate-700 hover:bg-slate-800'
            }`}
          >
            All ({centres.length})
          </button>

          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 ${
                selectedType === type
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                  : 'bg-[#0f172a] text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isNew ? 'Add Affiliated Centre' : `Edit "${editingItem.name}"`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure centre details, classification, contact person, and official phone numbers.
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {duplicateWarning && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2.5">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Centre Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Centre Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. PAAVAI Engineering College"
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Centre Type Selector */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Centre Type <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomType(!showCustomType)}
                      className="text-xs text-amber-400 hover:underline font-mono"
                    >
                      {showCustomType ? '← Select Standard Type' : '+ Add Custom Type'}
                    </button>
                  </div>

                  {showCustomType ? (
                    <input
                      type="text"
                      required
                      value={customTypeInput}
                      onChange={(e) => setCustomTypeInput(e.target.value)}
                      placeholder="Enter new Centre Type (e.g. Powerlifting Club)"
                      className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-amber-500/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <select
                      value={editingItem.centreType || 'Gym'}
                      onChange={(e) => setEditingItem({ ...editingItem, centreType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {availableTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Contact Person / Coach
                  </label>
                  <input
                    type="text"
                    value={editingItem.contactPerson || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, contactPerson: e.target.value })}
                    placeholder="e.g. S. SHANMUGAM"
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    placeholder="e.g. 9944301212 or +91 9944301212"
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Secondary Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Secondary Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingItem.secondaryPhone || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, secondaryPhone: e.target.value })}
                    placeholder="e.g. 0427 2445566"
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.displayOrder ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editingItem.address || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                    placeholder="e.g. Salem, Tamil Nadu"
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Google Maps URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="url"
                    value={editingItem.googleMapsUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, googleMapsUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description &amp; Training Details
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Training facilities, morning/evening schedules, coaching credentials..."
                    className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Image / Logo Uploader */}
                <div className="sm:col-span-2">
                  <ImageUploader
                    label="Centre Image / Official Logo"
                    value={editingItem.imageUrl || editingItem.logoUrl || ''}
                    onChange={(url, publicId) =>
                      setEditingItem({
                        ...editingItem,
                        imageUrl: url,
                        logoUrl: url,
                        imagePublicId: publicId,
                      })
                    }
                    folder="sdwa/institutions"
                    aspectRatio="video"
                  />
                </div>

                {/* Published Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={editingItem.isPublished ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-[#0f172a] border-slate-700 focus:ring-amber-500"
                  />
                  <label htmlFor="isPublished" className="text-xs font-semibold text-slate-200">
                    Publish in public Affiliated Centres directory
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 shadow-lg"
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Centre'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Delete &quot;{deleteConfirmTarget.name}&quot;?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will remove the centre from the public Affiliated Centres directory.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Data View: Table on Desktop, Cards on Mobile */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#1e293b] rounded-3xl border border-slate-800">
          Loading affiliated centres...
        </div>
      ) : filteredCentres.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#1e293b] rounded-3xl border border-slate-800 space-y-4">
          <p>No affiliated centres match your search or filter.</p>
          <button
            onClick={handleSeedVerified}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold uppercase"
          >
            <Database size={14} />
            <span>Seed 15 Verified Centres</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on small screens) */}
          <div className="hidden md:block bg-[#1e293b] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0f172a] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Centre Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Contact Person</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-4 py-4 text-center">Order</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCentres.map((item) => {
                    const isPub = item.isPublished !== false && item.isActive !== false;
                    const contact = item.contactPerson || item.coachName || '—';
                    const phone = item.phone || '—';
                    const type = item.centreType || item.organizationType || 'Centre';

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0 font-mono text-xs">
                              <Building2 size={16} />
                            </div>
                            <span className="truncate max-w-xs">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-amber-400 border border-slate-700">
                            {type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-medium">{contact}</td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {item.phone ? (
                            <a href={`tel:${item.phone.replace(/\s+/g, '')}`} className="text-emerald-400 hover:underline">
                              {item.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-xs text-slate-400">
                          {item.displayOrder ?? 1}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(item)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                              isPub
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-700/40 text-slate-400 border border-slate-600'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {isPub ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{isPub ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsNew(false);
                                setShowCustomType(false);
                                setError(null);
                              }}
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
                              title="Edit Centre"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmTarget(item)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                              title="Delete Centre"
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
            </div>
          </div>

          {/* Mobile Card View (shown below md breakpoint) */}
          <div className="md:hidden space-y-4">
            {filteredCentres.map((item) => {
              const isPub = item.isPublished !== false && item.isActive !== false;
              const contact = item.contactPerson || item.coachName;
              const type = item.centreType || item.organizationType || 'Centre';

              return (
                <div
                  key={item.id}
                  className="bg-[#1e293b] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 border border-slate-700 mb-1.5">
                        {type}
                      </span>
                      <h3 className="font-oswald text-lg font-bold text-white leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        isPub
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700/40 text-slate-400 border border-slate-600'
                      }`}
                    >
                      {isPub ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    {contact && (
                      <p>
                        <span className="text-slate-400">Contact:</span>{' '}
                        <strong className="text-white">{contact}</strong>
                      </p>
                    )}
                    {item.phone && (
                      <p>
                        <span className="text-slate-400">Phone:</span>{' '}
                        <a href={`tel:${item.phone}`} className="text-emerald-400 font-mono font-bold">
                          {item.phone}
                        </a>
                      </p>
                    )}
                    {item.address && (
                      <p className="text-slate-400 line-clamp-1">
                        <span>Address:</span> {item.address}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-500">Order: #{item.displayOrder ?? 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsNew(false);
                          setShowCustomType(false);
                          setError(null);
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmTarget(item)}
                        className="p-2 bg-slate-800 hover:bg-rose-950/60 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
