'use client';

import React, { useState, useMemo } from 'react';
import { Tournament } from '@/types';
import TournamentCard from './TournamentCard';
import EmptyState from './EmptyState';
import { Swords, CheckCircle2, Clock, CalendarX2 } from 'lucide-react';
import { toSafeDate } from '@/lib/utils/formatDate';

interface TournamentsListProps {
  initialTournaments: Tournament[];
}

export default function TournamentsList({ initialTournaments }: TournamentsListProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'CLOSED' | 'PAST'>('ALL');

  React.useEffect(() => {
    setTournaments(initialTournaments);
  }, [initialTournaments]);

  React.useEffect(() => {
    async function syncTournaments() {
      try {
        const latest = await import('@/lib/firebase/firestore').then((m) =>
          m.getCollection<Tournament>('tournaments', { orderBy: 'displayOrder' })
        );
        if (latest) setTournaments(latest);
      } catch (e) {}
    }
    syncTournaments();
    const handleSync = () => syncTournaments();
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const now = new Date();

  // Categorize tournaments
  const categorized = useMemo(() => {
    return tournaments.map((t) => {
      const endDate = toSafeDate(t.endDate);
      const startDate = toSafeDate(t.startDate);
      const deadlineDate = toSafeDate(t.registrationDeadline);

      const isPast = endDate ? endDate < now : startDate ? startDate < now : false;
      const isDeadlinePassed = deadlineDate ? deadlineDate < now : false;
      const isOpen = t.registrationStatus === 'OPEN' && !isDeadlinePassed && !isPast;
      const isClosed = (t.registrationStatus === 'CLOSED' || isDeadlinePassed) && !isPast;
      const isUpcoming = !isPast;

      return {
        ...t,
        computedStatus: {
          isOpen,
          isClosed,
          isPast,
          isUpcoming,
        },
      };
    });
  }, [initialTournaments, now]);

  const filteredTournaments = useMemo(() => {
    if (activeTab === 'ALL') return categorized;
    if (activeTab === 'OPEN') return categorized.filter((t) => t.computedStatus.isOpen);
    if (activeTab === 'UPCOMING') return categorized.filter((t) => t.computedStatus.isUpcoming);
    if (activeTab === 'CLOSED') return categorized.filter((t) => t.computedStatus.isClosed);
    if (activeTab === 'PAST') return categorized.filter((t) => t.computedStatus.isPast);
    return categorized;
  }, [categorized, activeTab]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Championships ({categorized.length})
        </button>

        <button
          onClick={() => setActiveTab('OPEN')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'OPEN'
              ? 'bg-green-600 text-white shadow'
              : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Registration Open ({categorized.filter((t) => t.computedStatus.isOpen).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'UPCOMING'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Upcoming Schedule ({categorized.filter((t) => t.computedStatus.isUpcoming).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CLOSED')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'CLOSED'
              ? 'bg-red-600 text-white shadow'
              : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Registration Closed ({categorized.filter((t) => t.computedStatus.isClosed).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PAST')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'PAST'
              ? 'bg-slate-700 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CalendarX2 className="w-3.5 h-3.5" />
          <span>Past Events ({categorized.filter((t) => t.computedStatus.isPast).length})</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {filteredTournaments.length === 0 ? (
        <EmptyState
          type="tournaments"
          title={`No ${activeTab === 'OPEN' ? 'Open Registrations' : activeTab === 'PAST' ? 'Past Events' : 'Tournaments'}`}
          message="No tournament records found in this category. Check back soon for upcoming schedule announcements."
          actionText="View All Tournaments"
          actionHref="/tournaments"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
