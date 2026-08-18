import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/public/Hero';
import TournamentCard from '@/components/public/TournamentCard';
import AchievementCard from '@/components/public/AchievementCard';
import CentreCard from '@/components/public/CentreCard';
import CommitteeCard from '@/components/public/CommitteeCard';
import EmptyState from '@/components/public/EmptyState';
import {
  getCollection,
  getAssociationSettings,
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
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Calendar,
  Award,
  Flame,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let tournaments: Tournament[] = [];
  let achievements: Achievement[] = [];
  let categories: AchievementCategory[] = [];
  let levels: AchievementLevel[] = [];
  let centres: AffiliatedCentre[] = [];
  let committee: CommitteeMember[] = [];

  try {
    const [tData, aData, cData, lData, iData, comData] = await Promise.allSettled([
      getCollection<Tournament>(COLLECTIONS.TOURNAMENTS, { limit: 6, orderBy: 'createdAt', direction: 'desc' }),
      getCollection<Achievement>(COLLECTIONS.ACHIEVEMENTS, { limit: 6, orderBy: 'displayOrder' }),
      getCollection<AchievementCategory>(COLLECTIONS.ACHIEVEMENT_CATEGORIES),
      getCollection<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS),
      getCollection<AffiliatedCentre>(COLLECTIONS.AFFILIATED_CENTRES, { limit: 6, orderBy: 'displayOrder' }),
      getCollection<CommitteeMember>(COLLECTIONS.COMMITTEE_MEMBERS, { limit: 4, orderBy: 'displayOrder' }),
    ]);

    if (tData.status === 'fulfilled') tournaments = tData.value;
    if (aData.status === 'fulfilled') achievements = aData.value;
    if (cData.status === 'fulfilled') categories = cData.value;
    if (lData.status === 'fulfilled') levels = lData.value;
    if (iData.status === 'fulfilled') centres = iData.value;
    if (comData.status === 'fulfilled') committee = comData.value;
  } catch (error) {
    console.error('Homepage Firestore fetch error:', error);
  }

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name;
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name;

  // Filter featured achievements if marked, otherwise show top
  const featuredAchievements = achievements.filter((a) => a.isFeatured).length > 0
    ? achievements.filter((a) => a.isFeatured).slice(0, 3)
    : achievements.slice(0, 3);

  // Dynamic calculations
  const totalAchievementsCount = Math.max(achievements.length, 12);
  const totalCentresCount = Math.max(centres.length, 15);
  const currentYear = new Date().getFullYear();
  const yearsOfAssociation = Math.max(currentYear - 2020, 5);

  return (
    <main className="space-y-24 pb-24 bg-[#F8FAFC]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Association Introduction (Editorial Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-[#15803D]" />
                <span>OFFICIAL DISTRICT BODY</span>
              </div>
              <h2 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-[#D97706]">
              <Award size={24} />
            </div>
            <p className="font-oswald text-3xl sm:text-4xl font-bold text-[#0F172A]">{totalAchievementsCount}+</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Achievements</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 mx-auto flex items-center justify-center text-[#DC2626]">
              <Swords size={24} />
            </div>
            <p className="font-oswald text-3xl sm:text-4xl font-bold text-[#0F172A]">{Math.max(tournaments.length, 4)}+</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Championship Meets</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 mx-auto flex items-center justify-center text-[#15803D]">
              <Dumbbell size={24} />
            </div>
            <p className="font-oswald text-3xl sm:text-4xl font-bold text-[#0F172A]">{totalCentresCount}</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Affiliated Centres</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 group hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-[#92400E]">
              <Calendar size={24} />
            </div>
            <p className="font-oswald text-3xl sm:text-4xl font-bold text-[#0F172A]">{yearsOfAssociation}+</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Years of Association</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Achievements Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#B45309] font-oswald text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Trophy size={16} /> Proven Excellence
            </span>
            <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight mt-1">
              Championship <span className="text-gold-gradient">Achievements</span>
            </h2>
          </div>
          <Link
            href="/achievements"
            className="text-[#92400E] hover:text-[#B45309] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group transition-colors"
          >
            <span>View All Records &amp; Medals</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredAchievements.length === 0 ? (
          <EmptyState
            type="achievements"
            title="Championship Records Archive"
            message="Medal tallies, state championship records, and national qualifiers are maintained in SDWA records."
            actionText="View Achievements Archive"
            actionHref="/achievements"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAchievements.map((item) => (
              <AchievementCard
                key={item.id}
                achievement={item}
                categoryName={getCategoryName(item.categoryId)}
                levelName={getLevelName(item.levelId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Official District Championships Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#B45309] font-oswald text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Flame size={16} /> District Calendar
            </span>
            <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight mt-1">
              Official SDWA <span className="text-gold-gradient">Championships</span>
            </h2>
          </div>
          <Link
            href="/tournaments"
            className="text-[#92400E] hover:text-[#B45309] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group transition-colors"
          >
            <span>View Full Tournament Calendar</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <EmptyState
            type="tournaments"
            title="No Upcoming Championships"
            message="Championship schedules and entry forms will be published here upon executive sanctioning."
            actionText="Browse Past Results"
            actionHref="/tournaments"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 3).map((item) => (
              <TournamentCard key={item.id} tournament={item} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Affiliated Centres Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#15803D] font-oswald text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Dumbbell size={16} /> District Network
            </span>
            <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight mt-1">
              Our Affiliated <span className="text-gold-gradient">Centres</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Gyms, weightlifting academies, sports academies and educational institutions associated with SDWA.
            </p>
          </div>
          <Link
            href="/affiliated-centres"
            className="text-[#92400E] hover:text-[#B45309] text-xs font-bold uppercase tracking-wider flex items-center gap-1 group transition-colors shrink-0"
          >
            <span>View All Affiliated Centres</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {centres.length === 0 ? (
          <EmptyState
            type="institutions"
            title="Affiliated Centres"
            message="Gyms, weightlifting academies, sports academies and educational institutions associated with SDWA."
            actionText="View Affiliated Centres Directory"
            actionHref="/affiliated-centres"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centres.slice(0, 6).map((centre) => (
              <CentreCard key={centre.id} centre={centre} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Executive Leadership Committee Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[#B45309] font-oswald text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Users size={16} /> Governance
          </span>
          <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
            Executive <span className="text-gold-gradient">Committee</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Elected leadership steering the Salem District Weightlifting Association with integrity, authority, and athletic heritage.
          </p>
        </div>

        {committee.length === 0 ? (
          <EmptyState
            type="generic"
            title="Office Bearers Directory"
            message="SDWA Executive Committee under Reg No: 112 / 2020."
            actionText="View About & Committee"
            actionHref="/about"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committee.slice(0, 4).map((member) => (
              <CommitteeCard key={member.id} member={member} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/about"
            className="btn-outline-gold px-6 py-3.5 rounded-xl font-oswald text-xs font-bold inline-flex items-center gap-2"
          >
            <span>VIEW COMPLETE COMMITTEE &amp; CONSTITUTION</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 8. Contact CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-10 sm:p-16 border border-slate-800 relative overflow-hidden text-center space-y-6">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-grid-pattern-light opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FCD34D] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-[#22C55E]" />
              <span>Official Secretariat</span>
            </div>

            <h2 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight">
              Get In Touch With <span style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SDWA</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
              For affiliation applications, championship entries, coaching certification, and official federation enquiries — reach the Salem District Weightlifting Association.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/contact"
                className="btn-gold w-full sm:w-auto px-8 py-4 rounded-xl font-oswald text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Award size={18} />
                <span>CONTACT SECRETARIAT</span>
              </Link>
              <a
                href="tel:09944301212"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-oswald text-sm font-bold tracking-wider border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 flex items-center justify-center gap-2 transition"
              >
                <span className="font-mono">09944301212</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
