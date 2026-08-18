'use client';

import React from 'react';
import { AssociationObjective } from '@/types';
import {
  Trophy,
  Sparkles,
  BookOpen,
  Dumbbell,
} from 'lucide-react';

interface SportingObjectivesSectionProps {
  objectives: AssociationObjective[];
}

const SPORTING_ICONS = [
  Trophy,     // Conducting District-Level Competitions
  Sparkles,   // Identifying & Supporting Talent
  BookOpen,   // Teaching the Art of Weightlifting
];

export default function SportingObjectivesSection({
  objectives,
}: SportingObjectivesSectionProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="sporting-objectives">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-widest">
          <Dumbbell size={14} className="text-[#15803D]" />
          <span>Athletic Mandate</span>
        </div>
        <h2 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight">
          Our Sporting <span className="text-gold-gradient">Objectives</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          Focused sporting initiatives to develop grassroots talent and advance competitive standards across Salem District.
        </p>
      </div>

      {/* 3 Sporting Objectives in a visually distinct layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {objectives.map((item, index) => {
          const Icon = SPORTING_ICONS[index % SPORTING_ICONS.length] || Trophy;

          return (
            <div
              key={item.id || index}
              className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200 shadow-sm hover:border-[#15803D] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Deep Green Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#15803D]" />

              <div className="space-y-5">
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-[#15803D] group-hover:bg-[#15803D] group-hover:text-white transition-colors duration-200 shadow-sm">
                  <Icon size={26} />
                </div>

                {/* Objective Heading */}
                <h3 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-[#0F172A] tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#15803D]">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span>Salem District Priority</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
