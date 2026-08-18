'use client';

import React, { useState, useMemo } from 'react';
import { AffiliatedCentre } from '@/types';
import CentreCard from './CentreCard';
import { Search, X, SlidersHorizontal, ArrowDownAZ, Layers, Sparkles } from 'lucide-react';

interface CentresListProps {
  initialCentres: AffiliatedCentre[];
}

export default function CentresList({ initialCentres }: CentresListProps) {
  const [centres, setCentres] = useState<AffiliatedCentre[]>(initialCentres);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'order' | 'alphabetical'>('order');

  React.useEffect(() => {
    setCentres(initialCentres);
  }, [initialCentres]);

  React.useEffect(() => {
    async function syncCentres() {
      try {
        const latest = await import('@/lib/firebase/firestore').then((m) =>
          m.getCollection<AffiliatedCentre>('affiliatedCentres', { orderBy: 'displayOrder' })
        );
        if (latest) setCentres(latest);
      } catch (e) {}
    }
    syncCentres();
    const handleSync = () => syncCentres();
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Dynamically extract unique centre types from published data with counts
  const dynamicTypes = useMemo(() => {
    const counts = new Map<string, number>();
    centres.forEach((c) => {
      const type = c.centreType || c.organizationType || 'Other';
      counts.set(type, (counts.get(type) || 0) + 1);
    });

    const typesList: { type: string; count: number }[] = [];
    counts.forEach((count, type) => {
      typesList.push({ type, count });
    });

    // Sort by count descending or logical priority
    return typesList.sort((a, b) => b.count - a.count);
  }, [centres]);

  // Combined Search & Filter Logic
  const filteredAndSorted = useMemo(() => {
    const result = centres.filter((centre) => {
      // Filter by type
      if (selectedType !== 'ALL') {
        const type = centre.centreType || centre.organizationType;
        if (type !== selectedType) return false;
      }

      // Filter by search query (case-insensitive across name, contactPerson/coachName, centreType)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (centre.name || '').toLowerCase().includes(q);
        const contactMatch = (centre.contactPerson || centre.coachName || '').toLowerCase().includes(q);
        const typeMatch = (centre.centreType || centre.organizationType || '').toLowerCase().includes(q);
        const addressMatch = (centre.address || '').toLowerCase().includes(q);
        const phoneMatch = (centre.phone || '').includes(q);

        return nameMatch || contactMatch || typeMatch || addressMatch || phoneMatch;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      // Default: Association Order (displayOrder)
      const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 999;
      const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 999;
      return orderA - orderB;
    });
  }, [initialCentres, selectedType, searchQuery, sortBy]);

  const hasActiveFilters = selectedType !== 'ALL' || searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedType('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Bar */}
      <div className="bg-[#1e293b] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by centre name, coach, type, or phone..."
              className="w-full pl-11 pr-10 py-3 bg-[#0f172a] border border-slate-700 focus:border-amber-500 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono hidden sm:inline">
              Sort:
            </span>
            <div className="inline-flex p-1 bg-[#0f172a] border border-slate-700 rounded-xl">
              <button
                onClick={() => setSortBy('order')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  sortBy === 'order'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Association Order
              </button>
              <button
                onClick={() => setSortBy('alphabetical')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  sortBy === 'alphabetical'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                <span>A–Z</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-[#0f172a] text-slate-300 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            All ({initialCentres.length})
          </button>

          {dynamicTypes.map(({ type, count }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
                selectedType === type
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-[#0f172a] text-slate-300 border border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              {type} ({count})
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition shrink-0 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Showing <span className="text-amber-400">{filteredAndSorted.length}</span> of {initialCentres.length} Affiliated Centres
        </p>
      </div>

      {/* Directory Grid or Empty State */}
      {filteredAndSorted.length === 0 ? (
        <div className="bg-[#1e293b] rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-oswald text-2xl font-bold uppercase text-white tracking-wide">
            {initialCentres.length === 0
              ? 'No affiliated centres are currently listed.'
              : 'No affiliated centres match your search.'}
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {initialCentres.length === 0
              ? 'Please check back soon as our affiliated gyms, academies, and educational institutions are being updated.'
              : 'Try searching with different keywords or reset your filters to view all affiliated organizations.'}
          </p>
          {hasActiveFilters && (
            <div className="pt-2">
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-xs transition shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Clear Search &amp; Filters</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSorted.map((centre) => (
            <CentreCard key={centre.id} centre={centre} />
          ))}
        </div>
      )}
    </div>
  );
}
