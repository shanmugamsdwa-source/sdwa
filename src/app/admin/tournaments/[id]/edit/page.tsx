'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Tournament, WeightDivision, WeightClass, COLLECTIONS } from '@/types';
import { getDocument, getCollection, updateDocument } from '@/lib/firebase/firestore';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDateTimeForInput } from '@/lib/utils/formatDate';

export default function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [divisions, setDivisions] = useState<WeightDivision[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);

  const [form, setForm] = useState<Partial<Tournament>>({
    title: '',
    description: '',
    venue: '',
    startDate: undefined,
    endDate: undefined,
    registrationDeadline: undefined,
    registrationMode: 'EXTERNAL_FORM',
    registrationUrl: '',
    registrationStatus: 'OPEN',
    posterUrl: '',
    posterPublicId: '',
    divisionIds: [],
    weightClassIds: [],
    isPublished: true,
    isFeatured: false,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [tData, divs, weights] = await Promise.all([
        getDocument<Tournament>(COLLECTIONS.TOURNAMENTS, id),
        getCollection<WeightDivision>(COLLECTIONS.WEIGHT_DIVISIONS, { orderBy: 'displayOrder' }),
        getCollection<WeightClass>(COLLECTIONS.WEIGHT_CLASSES, { orderBy: 'displayOrder' }),
      ]);

      if (tData) {
        setForm(tData);
      }
      setDivisions(divs);
      setWeightClasses(weights);
    } catch (err) {
      console.error(err);
      setError('Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate as any) : null,
        endDate: form.endDate ? new Date(form.endDate as any) : null,
        registrationDeadline: form.registrationDeadline
          ? new Date(form.registrationDeadline as any)
          : null,
      };

      await updateDocument(COLLECTIONS.TOURNAMENTS, id, payload as any);
      router.push('/admin/tournaments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  const toggleWeightClass = (wcId: string) => {
    const current = form.weightClassIds || [];
    if (current.includes(wcId)) {
      setForm({ ...form, weightClassIds: current.filter((x: string) => x !== wcId) });
    } else {
      setForm({ ...form, weightClassIds: [...current, wcId] });
    }
  };

  const toggleDivision = (divId: string) => {
    const current = form.divisionIds || [];
    if (current.includes(divId)) {
      setForm({ ...form, divisionIds: current.filter((x: string) => x !== divId) });
    } else {
      setForm({ ...form, divisionIds: [...current, divId] });
    }
  };

  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      if (dateVal.toDate) return dateVal.toDate().toISOString().split('T')[0];
      const d = dateVal._seconds ? new Date(dateVal._seconds * 1000) : new Date(dateVal);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <Loader2 className="animate-spin mr-2" /> Loading tournament...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tournaments"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Championship / Meet</h1>
          <p className="text-slate-400 text-sm">Update tournament schedule, weight classes, or entry form</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Championship Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formatDateForInput(form.startDate)}
                onChange={(e) => setForm({ ...form, startDate: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={formatDateForInput(form.endDate)}
                onChange={(e) => setForm({ ...form, endDate: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Venue / Stadium *</label>
            <input
              type="text"
              required
              value={form.venue || ''}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description / Rules</label>
            <textarea
              rows={4}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <ImageUploader
            label="Tournament Official Poster"
            value={form.posterUrl || ''}
            onChange={(url, publicId) =>
              setForm({ ...form, posterUrl: url, posterPublicId: publicId || '' })
            }
            folder="sdwa/tournaments"
            aspectRatio="portrait"
          />
        </div>

        {/* Registration */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Registration &amp; Entry Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Registration Status
              </label>
              <select
                value={form.registrationStatus}
                onChange={(e) =>
                  setForm({ ...form, registrationStatus: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="OPEN">OPEN (Accepting Entries)</option>
                <option value="CLOSED">CLOSED (Registration Locked)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Application Deadline (Date &amp; Time) *
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeForInput(form.registrationDeadline)}
                onChange={(e) =>
                  setForm({ ...form, registrationDeadline: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
              <p className="text-[11px] text-amber-400/90 mt-1">
                Specify the exact cutoff date &amp; time (e.g. 06:00 PM). The &quot;Apply Now&quot; button will automatically disable at this exact minute while preserving all tournament details.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Google Form / Entry URL
              </label>
              <input
                type="url"
                value={form.registrationUrl || ''}
                onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                placeholder="https://forms.gle/..."
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-600 rounded-lg text-white text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">Paste the external Google Form or registration portal URL for athletes to apply.</p>
            </div>
          </div>
        </div>

        {/* Weight Divisions & Classes Selection */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Applicable Divisions &amp; Weight Classes</h2>
          <p className="text-xs text-slate-400">
            Select the specific divisions and weight categories for this championship.
          </p>

          <div className="space-y-4">
            {divisions.map((div) => {
              const divClasses = weightClasses.filter((wc) => wc.divisionId === div.id);
              const isDivSelected = (form.divisionIds || []).includes(div.id);

              return (
                <div key={div.id} className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDivSelected}
                        onChange={() => toggleDivision(div.id)}
                        className="rounded bg-slate-800 border-slate-600 text-[var(--color-accent)]"
                      />
                      <span className="font-semibold text-sm text-white">{div.name}</span>
                    </label>
                  </div>

                  {divClasses.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                      {divClasses.map((wc) => {
                        const isSelected = (form.weightClassIds || []).includes(wc.id);
                        return (
                          <button
                            key={wc.id}
                            type="button"
                            onClick={() => toggleWeightClass(wc.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                              isSelected
                                ? 'bg-[var(--color-accent)] text-white font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {wc.displayValue}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-[var(--color-accent)]"
            />
            <span className="text-sm text-slate-300">Published on Website</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="rounded bg-slate-800 border-slate-600 text-[var(--color-accent)]"
            />
            <span className="text-sm text-slate-300">Feature on Homepage</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/tournaments"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white rounded-xl text-sm font-medium disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Updating...' : 'Update Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
}
