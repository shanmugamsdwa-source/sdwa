import Link from 'next/link';
import { Achievement } from '@/types';
import { Trophy, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  achievement: Achievement;
  categoryName?: string;
  levelName?: string;
}

export default function AchievementCard({ achievement, categoryName, levelName }: Props) {
  const detailUrl = `/achievements/${(achievement as any).slug || achievement.id}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-amber-200/80 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl relative overflow-hidden">
      <div>
        {/* Tier & Category Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <Trophy size={12} className="text-[#D97706]" />
            {levelName || 'Championship'}
          </span>
          <span className="font-mono text-xs font-bold text-slate-500">
            {achievement.season || `${achievement.startYear}/${achievement.endYear}`}
          </span>
        </div>

        {/* Title */}
        <Link href={detailUrl} className="block">
          <h3 className="font-oswald text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors leading-snug">
            {achievement.title}
          </h3>
        </Link>

        {achievement.eventName && (
          <p className="text-xs font-bold text-[#DC2626] uppercase tracking-wide mt-1">
            {achievement.eventName}
          </p>
        )}

        {categoryName && (
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold">
            Category: {categoryName}
          </div>
        )}

        {achievement.venue && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2.5 font-medium">
            <MapPin size={13} className="text-[#D97706] shrink-0" />
            <span className="truncate">{achievement.venue}</span>
          </div>
        )}

        {achievement.description && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-3 pt-3 border-t border-slate-100">
            {achievement.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
        <Link
          href={detailUrl}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-red-700 transition"
        >
          <span>View Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <span className="text-[10px] text-[#15803D] font-bold">● SDWA Certified</span>
      </div>
    </div>
  );}
