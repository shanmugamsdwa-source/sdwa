import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, Achievement, AchievementCategory, AchievementLevel } from '@/types';
import { Trophy } from 'lucide-react';
import AchievementsArchive from '@/components/public/AchievementsArchive';

export const metadata = {
  title: 'Championship Achievements & Medal Records | SDWA',
  description:
    'Official records, medals, and championship achievements of Salem District Weightlifting Association athletes across District, State, National, and International meets.',
};

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  let achievements: Achievement[] = [];
  let categories: AchievementCategory[] = [];
  let levels: AchievementLevel[] = [];

  try {
    const [aData, cData, lData] = await Promise.allSettled([
      getCollection<Achievement>(COLLECTIONS.ACHIEVEMENTS, { orderBy: 'displayOrder' }),
      getCollection<AchievementCategory>(COLLECTIONS.ACHIEVEMENT_CATEGORIES, { orderBy: 'displayOrder' }),
      getCollection<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS, { orderBy: 'displayOrder' }),
    ]);

    if (aData.status === 'fulfilled') achievements = aData.value;
    if (cData.status === 'fulfilled') categories = cData.value;
    if (lData.status === 'fulfilled') levels = lData.value;
  } catch (error) {
    console.error('Achievements page fetch error:', error);
  }

  return (
    <main className="space-y-12 py-16 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-wider">
          <Trophy size={14} className="text-[#D97706]" />
          <span>Proven Track Record</span>
        </div>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[#0F172A] tracking-tight">
          Championship <span className="text-gold-gradient">Achievements</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Official medal registry and championship milestones achieved by Salem district weightlifters in senior, junior, and youth divisions.
        </p>
      </section>

      {/* Dynamic Archive with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AchievementsArchive
          initialAchievements={achievements}
          categories={categories}
          levels={levels}
        />
      </section>
    </main>
  );
}
