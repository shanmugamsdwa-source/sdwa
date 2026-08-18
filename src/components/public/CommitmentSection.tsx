'use client';

import React from 'react';
import { AssociationObjective } from '@/types';
import { ShieldCheck, Scale, Award } from 'lucide-react';

interface CommitmentSectionProps {
  commitments: AssociationObjective[];
}

export default function CommitmentSection({
  commitments,
}: CommitmentSectionProps) {
  if (!commitments || commitments.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="commitment">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-[#FCD34D] text-xs font-bold uppercase tracking-widest">
          <ShieldCheck size={14} className="text-[#22C55E]" />
          <span>Organizational Principles</span>
        </div>
        <h2 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight">
          Our <span className="text-gold-gradient">Commitment</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          The non-profit and non-political ethics safeguarding the integrity and public mission of our association.
        </p>
      </div>

      {/* Prominent 2-Column Commitment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {commitments.map((item, index) => {
          const isPublicWelfare = index === 0 || item.title.toLowerCase().includes('public') || item.shortTitle?.toLowerCase().includes('public');
          const Icon = isPublicWelfare ? Award : Scale;

          return (
            <div
              key={item.id || index}
              className="bg-[#0F172A] rounded-3xl p-8 sm:p-10 border border-slate-800 text-white relative overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              {/* Subtle gold / red top accent border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isPublicWelfare
                    ? 'bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]'
                    : 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C]'
                }`}
              />

              <div className="space-y-6">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-bold uppercase tracking-widest text-[#FCD34D]">
                    <Icon size={14} className={isPublicWelfare ? 'text-[#F59E0B]' : 'text-[#DC2626]'} />
                    <span>{item.shortTitle || (isPublicWelfare ? 'PUBLIC WELFARE' : 'NON-POLITICAL')}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-semibold">
                    PRINCIPLE {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Main Heading */}
                <h3 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
                  {item.title}
                </h3>

                {/* Principle Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Bottom Authority Seal */}
              <div className="pt-6 mt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-[11px]">
                  SDWA Official Constitution
                </span>
                <span className="text-[#FCD34D] font-mono text-[11px] font-bold">
                  Verified &bull; Reg. No: 112 / 2020
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
