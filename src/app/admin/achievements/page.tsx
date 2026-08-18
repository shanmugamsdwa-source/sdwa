'use client';

import { useState, useEffect, useCallback } from 'react';
import { Achievement, AchievementCategory, AchievementLevel, COLLECTIONS } from '@/types';
import { getCollection, deleteDocument } from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [levels, setLevels] = useState<AchievementLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [cats, levs] = await Promise.all([
        getCollection<AchievementCategory>(COLLECTIONS.ACHIEVEMENT_CATEGORIES, { orderBy: 'displayOrder' }),
        getCollection<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS, { orderBy: 'displayOrder' }),
      ]);

      setCategories(cats);
      setLevels(levs);

      const where: [string, any, unknown][] = [];
      if (selectedCategory !== 'ALL') where.push(['categoryId', '==', selectedCategory]);
      if (selectedLevel !== 'ALL') where.push(['levelId', '==', selectedLevel]);

      const achs = await getCollection<Achievement>(COLLECTIONS.ACHIEVEMENTS, {
        where: where.length > 0 ? where : undefined,
        orderBy: 'displayOrder',
      });

      setAchievements(achs);
    } catch (err) {
      console.error(err);
      setError('Failed to load achievements data');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLevel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await deleteDocument(COLLECTIONS.ACHIEVEMENTS, id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete achievement');
    }
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id || '—';

  const getLevelName = (id: string) =>
    levels.find((l) => l.id === id)?.name || id || '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage association records, medals, championships, and athletic milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/achievements/categories"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700"
          >
            Categories
          </Link>
          <Link
            href="/admin/achievements/levels"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700"
          >
            Levels
          </Link>
          <Link
            href="/admin/achievements/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-light)]"
          >
            <Plus size={16} /> Add Achievement
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter size={14} /> Filter by:
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 bg-[#0f172a] border border-slate-700 rounded-lg text-xs text-white"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-1.5 bg-[#0f172a] border border-slate-700 rounded-lg text-xs text-white"
        >
          <option value="ALL">All Levels</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Achievements Table */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No achievements found. Click &quot;Add Achievement&quot; to create a record.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Title / Event</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Season</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {achievements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{item.title}</div>
                    {item.eventName && (
                      <div className="text-xs text-slate-400 mt-0.5">{item.eventName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{getCategoryName(item.categoryId)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-xs bg-slate-800 border border-slate-700 text-slate-300">
                      {getLevelName(item.levelId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {item.season || `${item.startYear}/${item.endYear}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isPublished
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/achievements/${item.id}/edit`}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
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
