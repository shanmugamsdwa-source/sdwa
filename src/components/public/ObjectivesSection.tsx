'use client';

import React from 'react';
import { AssociationObjective } from '@/types';
import {
  Zap,
  Trophy,
  Megaphone,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Target,
} from 'lucide-react';

interface ObjectivesSectionProps {
  objectives: AssociationObjective[];
}

const CORE_ICONS = [
  Zap,            // 01 - Human Potential & Strength
  Trophy,         // 02 - Competitive Participation
  Megaphone,      // 03 - Creating Awareness
  GraduationCap,  // 04 - Student Participation
  HeartPulse,     // 05 - Physical & Mental Well-being
  ShieldCheck,    // 06 - Developing Discipline Among Youth
];

export default function ObjectivesSection({ objectives }: ObjectivesSectionProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="objectives">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#92400E] text-xs font-bold uppercase tracking-widest">
          <Target size={14} className="text-[#D97706]" />
          <span>Foundational Principles</span>
        </div>
        <h2 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight">
          Our <span className="text-gold-gradient">Objectives</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          Official statutory aims and foundational goals steering the Salem District Weightlifting Association.
        </p>
      </div>

      {/* 6 Objective Cards: 3 col Desktop, 2 col Tablet, 1 col Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectives.map((item, index) => {
          const Icon = CORE_ICONS[index % CORE_ICONS.length] || Target;
          const numberFormatted = String(index + 1).padStart(2, '0');

          return (
            <article
              key={item.id || index}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-[#B45309] group-hover:via-[#D97706] group-hover:to-[#F59E0B] transition-colors" />

              <div className="space-y-4">
                {/* Header row: Number Badge & Minimal Icon */}
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-[#0F172A] text-[#FCD34D] font-mono text-xs font-bold tracking-wider">
                    {numberFormatted}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#B45309] group-hover:bg-[#B45309] group-hover:text-white transition-colors duration-200">
                    <Icon size={20} />
                  </div>
                </div>

                {/* Short Title Label */}
                {item.shortTitle && (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309] block">
                    {item.shortTitle}
                  </span>
                )}

                {/* Primary Objective Title */}
                <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-[#0F172A] leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pt-1">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium font-mono">
                <span>SDWA Objective</span>
                <span className="text-[#D97706] font-bold">#{numberFormatted}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
