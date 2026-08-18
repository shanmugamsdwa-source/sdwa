'use client';

import React, { useState, useMemo } from 'react';
import { AffiliatedInstitution } from '@/types';
import InstitutionCard from './InstitutionCard';
import EmptyState from './EmptyState';
import { Search, Building2, Dumbbell, GraduationCap } from 'lucide-react';

interface InstitutionsListProps {
  initialInstitutions: AffiliatedInstitution[];
}

export default function InstitutionsList({ initialInstitutions }: InstitutionsListProps) {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(() => {
    return initialInstitutions.filter((inst) => {
      if (selectedType !== 'ALL' && inst.organizationType !== selectedType) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = inst.name.toLowerCase().includes(q);
        const coachMatch = inst.coachName?.toLowerCase().includes(q);
        const addressMatch = inst.address?.toLowerCase().includes(q);
        return nameMatch || coachMatch || addressMatch;
      }
      return true;
    });
  }, [initialInstitutions, selectedType, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Ribbon */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search academy, gym, or coach..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'ALL'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({initialInstitutions.length})
          </button>

          <button
            onClick={() => setSelectedType('SPORTS_ACADEMY')}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'SPORTS_ACADEMY'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Academies</span>
          </button>

          <button
            onClick={() => setSelectedType('GYM')}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'GYM'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Gyms</span>
          </button>

          <button
            onClick={() => setSelectedType('EDUCATIONAL_INSTITUTION')}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              selectedType === 'EDUCATIONAL_INSTITUTION'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Colleges</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          type="institutions"
          title="No Matching Institutions"
          message="No affiliated institutions match the selected classification or search query."
          actionText="View All Institutions"
          actionHref="/institutions"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}
    </div>
  );
}
