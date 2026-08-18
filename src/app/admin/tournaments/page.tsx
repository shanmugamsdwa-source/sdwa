'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tournament, computeRegistrationState, COLLECTIONS } from '@/types';
import { getCollection, deleteDocument } from '@/lib/firebase/firestore';
import { Plus, Trash2, Edit, Swords, Calendar, MapPin, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function TournamentsAdminPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCollection<Tournament>(
        COLLECTIONS.TOURNAMENTS,
        { orderBy: 'createdAt', direction: 'desc' }
      );
      setTournaments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this championship?')) return;
    try {
      await deleteDocument(COLLECTIONS.TOURNAMENTS, id);
      fetchTournaments();
    } catch (err) {
      console.error(err);
      setError('Failed to delete tournament');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Championships & Tournaments</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage upcoming championships, entry forms, deadlines, and weight divisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/tournaments/divisions"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700"
          >
            Divisions
          </Link>
          <Link
            href="/admin/tournaments/weights"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700"
          >
            Weight Classes
          </Link>
          <Link
            href="/admin/tournaments/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-light)]"
          >
            <Plus size={16} /> Add Tournament
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-[#1e293b] rounded-2xl border border-slate-800">
          No tournaments created yet. Click &quot;Add Tournament&quot; to publish a championship notice.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tournaments.map((t) => {
            const regState = computeRegistrationState(t);
            return (
              <div
                key={t.id}
                className="bg-[#1e293b] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        regState === 'APPLY_NOW'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {regState === 'APPLY_NOW' ? 'Registration Open' : 'Registration Closed'}
                    </span>
                    <span
                      className={`text-xs ${
                        t.isPublished ? 'text-slate-400' : 'text-amber-400'
                      }`}
                    >
                      {t.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{t.title}</h3>

                  {t.venue && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <MapPin size={14} className="text-slate-500" />
                      <span>{t.venue}</span>
                    </div>
                  )}

                  {t.registrationUrl && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] mt-2 truncate">
                      <Link2 size={14} />
                      <a href={t.registrationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                        {t.registrationUrl}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
                  <span className="text-[11px] text-slate-500">
                    Mode: {t.registrationMode}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/tournaments/${t.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg"
                      title="Edit Tournament"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
