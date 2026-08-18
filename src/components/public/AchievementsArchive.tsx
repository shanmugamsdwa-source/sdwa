'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Achievement, AchievementCategory, AchievementLevel } from '@/types';
import AchievementCard from './AchievementCard';
import EmptyState from './EmptyState';
import { Filter, Search, RotateCcw } from 'lucide-react';

interface AchievementsArchiveProps {
  initialAchievements: Achievement[];
  categories: AchievementCategory[];
  levels: AchievementLevel[];
}

export default function AchievementsArchive({
  initialAchievements,
  categories,
  levels,
}: AchievementsArchiveProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    setAchievements(initialAchievements);
  }, [initialAchievements]);

  React.useEffect(() => {
    async function syncAchievements() {
      try {
        const latest = await import('@/lib/firebase/firestore').then((m) =>
          m.getCollection<Achievement>('achievements', { orderBy: 'displayOrder' })
        );
        if (latest) setAchievements(latest);
      } catch (e) {}
    }
    syncAchievements();
    const handleSync = () => syncAchievements();
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Extract unique seasons
  const seasons = useMemo(() => {
    const list = new Set<string>();
    achievements.forEach((a) => {
      if (a.season) list.add(a.season);
    });
    return Array.from(list).sort().reverse();
  }, [achievements]);

  // Dynamic filtered list
  const filtered = useMemo(() => {
    return achievements.filter((a) => {
      if (selectedCategory !== 'ALL' && a.categoryId !== selectedCategory) {
        return false;
      }
      if (selectedLevel !== 'ALL' && a.levelId !== selectedLevel) {
        return false;
      }
      if (selectedSeason !== 'ALL' && a.season !== selectedSeason) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const titleMatch = a.title.toLowerCase().includes(q);
        const eventMatch = a.eventName.toLowerCase().includes(q);
        const venueMatch = a.venue?.toLowerCase().includes(q);
        return titleMatch || eventMatch || venueMatch;
      }
      return true;
    });
  }, [achievements, selectedCategory, selectedLevel, selectedSeason, searchQuery]);

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name;
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name;

  const handleReset = () => {
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedSeason('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event, athlete name, or venue..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Competition Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="ALL">All Levels</option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="ALL">All Seasons</option>
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count + Reset */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-700">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-700">{achievements.length}</span> records
          </span>
          {(selectedCategory !== 'ALL' ||
            selectedLevel !== 'ALL' ||
            selectedSeason !== 'ALL' ||
            searchQuery !== '') && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          type="achievements"
          title="No Matching Achievements"
          message="No records found matching the selected filters. Try broadening your filter parameters."
          actionText="Reset Filters"
          actionHref="/achievements"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              categoryName={getCategoryName(a.categoryId)}
              levelName={getLevelName(a.levelId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
