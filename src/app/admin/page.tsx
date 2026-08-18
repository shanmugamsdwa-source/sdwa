'use client';

import { useEffect, useState } from 'react';
import {
  Trophy,
  Swords,
  Dumbbell,
  ImageIcon,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/types';

interface DashboardStats {
  achievements: number;
  tournaments: number;
  centres: number;
  albums: number;
  committee: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    achievements: 0,
    tournaments: 0,
    centres: 0,
    albums: 0,
    committee: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [achievements, tournaments, centres, albums, committee] = await Promise.all([
          getCollection(COLLECTIONS.ACHIEVEMENTS),
          getCollection(COLLECTIONS.TOURNAMENTS),
          getCollection(COLLECTIONS.AFFILIATED_CENTRES),
          getCollection(COLLECTIONS.GALLERY_ALBUMS),
          getCollection(COLLECTIONS.COMMITTEE_MEMBERS),
        ]);

        setStats({
          achievements: achievements.length,
          tournaments: tournaments.length,
          centres: centres.length,
          albums: albums.length,
          committee: committee.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Achievements',
      value: stats.achievements,
      icon: <Trophy size={22} />,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      href: '/admin/achievements',
    },
    {
      label: 'Tournaments',
      value: stats.tournaments,
      icon: <Swords size={22} />,
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
      href: '/admin/tournaments',
    },
    {
      label: 'Affiliated Centres',
      value: stats.centres,
      icon: <Dumbbell size={22} />,
      color: 'bg-green-500/10 text-green-400 border-green-500/20',
      href: '/admin/affiliated-centres',
    },
    {
      label: 'Gallery Albums',
      value: stats.albums,
      icon: <ImageIcon size={22} />,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      href: '/admin/gallery',
    },
    {
      label: 'Committee Members',
      value: stats.committee,
      icon: <Users size={22} />,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      href: '/admin/committee',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          SDWA Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time federation statistics, content management, and competition governance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#1E293B] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} border flex items-center justify-center`}>
                {stat.icon}
              </div>
              <TrendingUp
                size={16}
                className="text-slate-600 group-hover:text-slate-400 transition-colors"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono">
                {loading ? (
                  <span className="inline-block w-8 h-8 bg-slate-700 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-lg font-semibold text-white">Management Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Add Achievement', href: '/admin/achievements/new' },
            { label: 'Add Championship Meet', href: '/admin/tournaments/new' },
            { label: 'Manage Affiliated Centres', href: '/admin/affiliated-centres' },
            { label: 'Create Gallery Album', href: '/admin/gallery' },
            { label: 'Manage Committee Members', href: '/admin/committee' },
            { label: 'Edit Association Settings', href: '/admin/settings' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="px-4 py-3 bg-[#0F172A] hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-800 flex items-center justify-between group"
            >
              <span>+ {action.label}</span>
              <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
