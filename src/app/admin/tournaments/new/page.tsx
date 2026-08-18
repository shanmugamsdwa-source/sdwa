'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WeightDivision, WeightClass, RegistrationMode, RegistrationStatus, COLLECTIONS } from '@/types';
import { getCollection, createDocument } from '@/lib/firebase/firestore';
import ImageUploader from '@/components/admin/ImageUploader';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewTournamentPage() {
  const router = useRouter();
  const [divisions, setDivisions] = useState<WeightDivision[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    venue: '',
    levelId: '',
    categoryIds: [] as string[],
    divisions: [] as string[],
    weightClasses: [] as string[],
    posterUrl: '',
    posterPublicId: '',
    registrationMode: 'EXTERNAL_FORM' as RegistrationMode,
    registrationUrl: '',
    registrationStatus: 'OPEN' as RegistrationStatus,
    registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isFeatured: false,
    isPublished: true,
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [divs, weights] = await Promise.all([
          getCollection<WeightDivision>(COLLECTIONS.WEIGHT_DIVISIONS, { orderBy: 'displayOrder' }),
          getCollection<WeightClass>(COLLECTIONS.WEIGHT_CLASSES, { orderBy: 'displayOrder' }),
        ]);
        setDivisions(divs);
        setWeightClasses(weights);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        registrationDeadline: new Date(formData.registrationDeadline),
      };

      await createDocument(COLLECTIONS.TOURNAMENTS, payload);
      router.push('/admin/tournaments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation error');
    } finally {
      setSaving(false);
    }
  };

  const toggleWeightClass = (wcId: string) => {
    const current = formData.weightClasses || [];
    if (current.includes(wcId)) {
      setFormData({ ...formData, weightClasses: current.filter((x) => x !== wcId) });
    } else {
      setFormData({ ...formData, weightClasses: [...current, wcId] });
    }
  };

  const toggleDivision = (divId: string) => {
    const current = formData.divisions || [];
    if (current.includes(divId)) {
      setFormData({ ...formData, divisions: current.filter((x) => x !== divId) });
    } else {
      setFormData({ ...formData, divisions: [...current, divId] });
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/tournaments"
          className="p-2 bg-[#1e293b] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Championship / Tournament</h1>
          <p className="text-slate-400 text-sm">Publish meet details, registration forms, and weight categories</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Championship Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Salem District Weightlifting Championship 2026"
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Venue / Arena *</label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. District Sports Stadium, Salem"
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">End Date *</label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Registration Form Link (External URL / Google Form)
            </label>
            <input
              type="url"
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              placeholder="https://forms.google.com/..."
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">Paste the external Google Form or registration portal URL for athletes to apply.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Registration Status *
            </label>
            <select
              value={formData.registrationStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registrationStatus: e.target.value as RegistrationStatus,
                })
              }
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="OPEN">Open (Accepting Entries)</option>
              <option value="CLOSED">Closed (Registration Locked)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Application Deadline (Date &amp; Time) *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
            <p className="text-[11px] text-amber-400/90 mt-1">
              Specify the exact cutoff date &amp; time (e.g. 06:00 PM). The &quot;Apply Now&quot; button will automatically disable at this exact minute while preserving all tournament details.
            </p>
          </div>

          <div className="md:col-span-2">
            <ImageUploader
              label="Official Tournament Poster"
              value={formData.posterUrl}
              onChange={(url, publicId) =>
                setFormData({
                  ...formData,
                  posterUrl: url,
                  posterPublicId: publicId || '',
                })
              }
              folder="sdwa/tournaments"
              aspectRatio="portrait"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Description / Rules</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Meet guidelines, eligibility criteria, schedule..."
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>
        </div>

        {/* Divisions & Weights */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <h3 className="text-base font-semibold text-white">Applicable Weight Divisions &amp; Classes</h3>
          <div className="space-y-3">
            {divisions.map((div) => {
              const divClasses = weightClasses.filter((wc) => wc.divisionId === div.id);
              const isDivSelected = formData.divisions.includes(div.id);

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
                        const isSelected = formData.weightClasses.includes(wc.id);
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

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="rounded bg-[#0f172a] border-slate-600 text-[var(--color-accent)]"
            />
            Publish on public site
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded bg-[#0f172a] border-slate-600 text-[var(--color-accent)]"
            />
            Featured on homepage
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Link
            href="/admin/tournaments"
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-light)] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </div>
  );
}
