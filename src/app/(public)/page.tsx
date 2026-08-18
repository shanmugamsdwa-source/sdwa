import HomePageClient from './HomePageClient';
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
    <HomePageClient
      initialTournaments={tournaments}
      initialAchievements={achievements}
      initialCategories={categories}
      initialLevels={levels}
      initialCentres={centres}
      initialCommittee={committee}
    />
  );
}
