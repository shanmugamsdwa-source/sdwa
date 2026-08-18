'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/public/Hero';
import TournamentCard from '@/components/public/TournamentCard';
import AchievementCard from '@/components/public/AchievementCard';
import CentreCard from '@/components/public/CentreCard';
import CommitteeCard from '@/components/public/CommitteeCard';
import {
  getCollection,
} from '@/lib/firebase/firestore';
import {
  COLLECTIONS,
  Tournament,
  Achievement,
  AchievementCategory,
  AchievementLevel,
  AffiliatedCentre,
  CommitteeMember,
} from '@/types';
import {
  Trophy,
  Swords,
  Dumbbell,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface HomePageClientProps {
  initialTournaments: Tournament[];
  initialAchievements: Achievement[];
  initialCategories: AchievementCategory[];
  initialLevels: AchievementLevel[];
  initialCentres: AffiliatedCentre[];
  initialCommittee: CommitteeMember[];
}

export default function HomePageClient({
  initialTournaments,
  initialAchievements,
  initialCategories,
  initialLevels,
  initialCentres,
  initialCommittee,
}: HomePageClientProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [categories, setCategories] = useState<AchievementCategory[]>(initialCategories);
  const [levels, setLevels] = useState<AchievementLevel[]>(initialLevels);
  const [centres, setCentres] = useState<AffiliatedCentre[]>(initialCentres);
  const [committee, setCommittee] = useState<CommitteeMember[]>(initialCommittee);

  useEffect(() => {
    async function syncHomepageData() {
      try {
        const [tData, aData, cData, lData, iData, comData] = await Promise.allSettled([
          getCollection<Tournament>(COLLECTIONS.TOURNAMENTS, { limit: 6, orderBy: 'createdAt', direction: 'desc' }),
          getCollection<Achievement>(COLLECTIONS.ACHIEVEMENTS, { limit: 6, orderBy: 'displayOrder' }),
          getCollection<AchievementCategory>(COLLECTIONS.ACHIEVEMENT_CATEGORIES),
          getCollection<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS),
          getCollection<AffiliatedCentre>(COLLECTIONS.AFFILIATED_CENTRES, { limit: 6, orderBy: 'displayOrder' }),
          getCollection<CommitteeMember>(COLLECTIONS.COMMITTEE_MEMBERS, { limit: 4, orderBy: 'displayOrder' }),
        ]);

        if (tData.status === 'fulfilled' && tData.value) setTournaments(tData.value);
        if (aData.status === 'fulfilled' && aData.value) setAchievements(aData.value);
        if (cData.status === 'fulfilled' && cData.value) setCategories(cData.value);
        if (lData.status === 'fulfilled' && lData.value) setLevels(lData.value);
        if (iData.status === 'fulfilled' && iData.value) setCentres(iData.value);
        if (comData.status === 'fulfilled' && comData.value) setCommittee(comData.value);
      } catch (err) {
        console.error('Homepage client sync error:', err);
      }
    }

    syncHomepageData();

    const handleSync = () => syncHomepageData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name;
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name;

  const featuredAchievements = achievements.filter((a) => a.isFeatured).length > 0
    ? achievements.filter((a) => a.isFeatured).slice(0, 3)
    : achievements.slice(0, 3);

  const totalAchievementsCount = Math.max(achievements.length, 12);
  const totalCentresCount = Math.max(centres.length, 15);
  const currentYear = new Date().getFullYear();
  const yearsOfAssociation = Math.max(currentYear - 2020, 5);

  return (
    <main className="space-y-16 sm:space-y-24 pb-16 sm:pb-24 bg-[#F8FAFC]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Association Introduction (Editorial Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-[#15803D]" />
                <span>OFFICIAL DISTRICT BODY</span>
              </div>
              <h2 className="font-oswald text-2xl sm:text-4xl lg:text-5xl font-bold uppercase text-[#0F172A] tracking-tight">
                Pioneering Strength &amp; Athleticism in Salem
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Salem District Weightlifting Association (SDWA) is the governing authority recognized by the Tamil Nadu State Weightlifting Association, mandated to govern Olympic weightlifting, conduct certified district championships, and foster world-class athletes.
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                From grassroots talent scouting in youth academies to conducting state-ranking championship meets, SDWA builds the platform where Salem athletes turn dedication into national podium glory.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <Link
                href="/about"
                className="btn-gold py-3.5 px-6 rounded-xl text-center text-xs font-bold font-oswald flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                <span>LEARN ABOUT SDWA</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/affiliated-centres"
                className="btn-outline-gold py-3.5 px-6 rounded-xl text-center text-xs font-bold font-oswald"
              >
                <span>EXPLORE AFFILIATED CENTRES</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Association Dynamic Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-[#D97706]">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-oswald text-2xl sm:text-4xl font-bold text-[#0F172A]">{totalAchievementsCount}+</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold">Total Achievements</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 mx-auto flex items-center justify-center text-[#DC2626]">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-oswald text-2xl sm:text-4xl font-bold text-[#0F172A]">{Math.max(tournaments.length, 4)}+</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold">Championship Meets</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 border border-green-200 mx-auto flex items-center justify-center text-[#15803D]">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-oswald text-2xl sm:text-4xl font-bold text-[#0F172A]">{totalCentresCount}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold">Affiliated Centres</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-[#92400E]">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="font-oswald text-2xl sm:text-4xl font-bold text-[#0F172A]">{yearsOfAssociation}+</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold">Years of Association</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Achievements Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy size={14} className="text-[#D97706]" />
              <span>HALL OF FAME</span>
            </div>
            <h2 className="font-oswald text-2xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
              Featured Medal Achievements
            </h2>
          </div>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#B45309] transition"
          >
            <span>View All Records</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAchievements.map((item) => (
            <AchievementCard
              key={item.id}
              achievement={item}
              categoryName={getCategoryName(item.categoryId)}
              levelName={getLevelName(item.levelId)}
            />
          ))}
        </div>
      </section>

      {/* 5. Upcoming & Recent Championships */}
      {tournaments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-2">
                <Swords size={14} className="text-[#DC2626]" />
                <span>COMPETITION SCHEDULE</span>
              </div>
              <h2 className="font-oswald text-2xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
                Championship Calendar
              </h2>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#B45309] transition"
            >
              <span>View Full Calendar</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 3).map((item) => (
              <TournamentCard key={item.id} tournament={item} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Affiliated Gyms & Academies */}
      {centres.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 size={14} className="text-[#15803D]" />
                <span>DISTRICT NETWORK</span>
              </div>
              <h2 className="font-oswald text-2xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
                Affiliated Training Centres
              </h2>
            </div>
            <Link
              href="/affiliated-centres"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#B45309] transition"
            >
              <span>View Directory</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centres.slice(0, 3).map((item) => (
              <CentreCard key={item.id} centre={item} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Executive Leadership & Committee */}
      {committee.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-2">
                <Users size={14} className="text-[#D97706]" />
                <span>LEADERSHIP</span>
              </div>
              <h2 className="font-oswald text-2xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
                Executive Committee
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#92400E] hover:text-[#B45309] transition"
            >
              <span>View Leadership</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committee.map((item) => (
              <CommitteeCard key={item.id} member={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
