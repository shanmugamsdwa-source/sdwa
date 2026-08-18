'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AchievementCategory, AchievementLevel, COLLECTIONS } from '@/types';
import { getCollection, createDocument } from '@/lib/firebase/firestore';
import MultiImageUploader, { UploadedMediaItem } from '@/components/admin/MultiImageUploader';
import InlineCategoryModal from '@/components/admin/InlineCategoryModal';
import InlineLevelModal from '@/components/admin/InlineLevelModal';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewAchievementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [levels, setLevels] = useState<AchievementLevel[]>([]);
  const [images, setImages] = useState<UploadedMediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCatModal, setShowCatModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    eventName: '',
    categoryId: '',
    levelId: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    venue: '',
    description: '',
    displayOrder: 1,
    isFeatured: false,
    isPublished: true,
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, levs] = await Promise.all([
          getCollection<AchievementCategory>(COLLECTIONS.ACHIEVEMENT_CATEGORIES, { orderBy: 'displayOrder' }),
          getCollection<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS, { orderBy: 'displayOrder' }),
        ]);

        setCategories(cats);
        if (cats.length > 0) setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));

        setLevels(levs);
        if (levs.length > 0) setFormData((prev) => ({ ...prev, levelId: levs[0].id }));
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
        season: `${formData.startYear}/${formData.endYear}`,
        images: images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          caption: img.caption,
          displayOrder: img.displayOrder,
        })),
      };

      await createDocument(COLLECTIONS.ACHIEVEMENTS, payload);
      router.push('/admin/achievements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/achievements"
          className="p-2 bg-[#1e293b] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Achievement</h1>
          <p className="text-slate-400 text-sm">Add a new competition award or record</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Gold Medal - 81kg Clean & Jerk"
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Event / Meet Name
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="e.g. 75th Senior National Weightlifting Championship"
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Category *
              </label>
              <button
                type="button"
                onClick={() => setShowCatModal(true)}
                className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> New
              </button>
            </div>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Level *
              </label>
              <button
                type="button"
                onClick={() => setShowLevelModal(true)}
                className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> New
              </button>
            </div>
            <select
              value={formData.levelId}
              onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Start Year *
            </label>
            <input
              type="number"
              required
              value={formData.startYear}
              onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) || 2025 })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">Starting year (e.g. 2025)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              End Year *
            </label>
            <input
              type="number"
              required
              value={formData.endYear}
              onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) || 2026 })}
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">Ending year (e.g. 2026 displays as &quot;2025/2026&quot;)</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Jawaharlal Nehru Stadium, Chennai"
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description / Athlete Details
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details regarding the medalists, lifts, or records broken..."
              className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <MultiImageUploader
              images={images}
              onChange={setImages}
              folder="sdwa/achievements"
              label="Podium & Ceremony Photos"
            />
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
            href="/admin/achievements"
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
            {saving ? 'Creating...' : 'Create Achievement'}
          </button>
        </div>
      </form>

      {/* Inline Creation Modals */}
      <InlineCategoryModal
        isOpen={showCatModal}
        onClose={() => setShowCatModal(false)}
        onCategoryCreated={(newCat) => {
          setCategories((prev) => [...prev, newCat]);
          setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
        }}
      />

      <InlineLevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        onLevelCreated={(newLevel) => {
          setLevels((prev) => [...prev, newLevel]);
          setFormData((prev) => ({ ...prev, levelId: newLevel.id }));
        }}
      />
    </div>
  );
}
