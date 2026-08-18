import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBySlugOrId, getDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS, Achievement, AchievementCategory, AchievementLevel } from '@/types';
import { Trophy, Calendar, MapPin, Award, ArrowLeft, ShieldCheck } from 'lucide-react';
import AchievementDetailClient from './AchievementDetailClient';

interface AchievementDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: AchievementDetailPageProps) {
  const { slug } = await params;
  const achievement = await getBySlugOrId<Achievement>(COLLECTIONS.ACHIEVEMENTS, slug);

  if (!achievement) {
    return {
      title: 'Achievement Not Found | SDWA',
    };
  }

  return {
    title: `${achievement.title} | SDWA Achievements`,
    description: achievement.description || `${achievement.title} - ${achievement.eventName} (${achievement.season})`,
    openGraph: {
      title: `${achievement.title} | SDWA`,
      description: achievement.description,
      images: achievement.images?.[0] ? [achievement.images[0].url] : ['/images/sdwa-logo.png'],
    },
  };
}

export default async function AchievementDetailPage({ params }: AchievementDetailPageProps) {
  const { slug } = await params;
  const achievement = await getBySlugOrId<Achievement>(COLLECTIONS.ACHIEVEMENTS, slug);

  if (!achievement) {
    notFound();
  }

  let category: AchievementCategory | null = null;
  let level: AchievementLevel | null = null;

  if (achievement.categoryId) {
    category = await getDocument<AchievementCategory>(
      COLLECTIONS.ACHIEVEMENT_CATEGORIES,
      achievement.categoryId
    );
  }

  if (achievement.levelId) {
    level = await getDocument<AchievementLevel>(
      COLLECTIONS.ACHIEVEMENT_LEVELS,
      achievement.levelId
    );
  }

  return (
    <main className="min-h-screen py-16 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Achievements Archive</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {level && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                {level.name}
              </span>
            )}
            {category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {category.name}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 font-mono">
              Season {achievement.season}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight leading-tight">
            {achievement.title}
          </h1>

          {/* Event Name */}
          <p className="font-oswald text-lg sm:text-xl font-bold text-[#DC2626] uppercase">
            {achievement.eventName}
          </p>

          {/* Details Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {achievement.venue && (
              <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue</span>
                  <span className="font-semibold text-slate-800">{achievement.venue}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Season</span>
                <span className="font-semibold text-slate-800">{achievement.season}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification</span>
                <span className="font-semibold text-green-700">Official SDWA Record</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {achievement.description && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-oswald text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official Report &amp; Highlights
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {achievement.description}
              </p>
            </div>
          )}
        </div>

        {/* Media Gallery / Lightbox */}
        {achievement.images && achievement.images.length > 0 && (
          <AchievementDetailClient images={achievement.images} />
        )}
      </div>
    </main>
  );
}
