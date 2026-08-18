'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AffiliatedCentre } from '@/types';
import { Dumbbell, Phone, User, ShieldCheck, ArrowRight, MapPin, Building2, Trophy, Award } from 'lucide-react';

interface Props {
  centre: AffiliatedCentre;
}

export default function CentreCard({ centre }: Props) {
  const detailUrl = `/affiliated-centres/${centre.slug || centre.id}`;
  const rawPhone = centre.phone || '';
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const contactName = centre.contactPerson || centre.coachName;
  const imageSrc = centre.imageUrl || centre.logoUrl;

  // Clean type styling
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Weightlifting Academy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Gym':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Fitness Centre':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Sports Academy':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Educational Institution':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl overflow-hidden">
      {/* Card Header & Brand Placeholder / Image */}
      <div>
        <div className="relative h-44 w-full bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={centre.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
                SDWA Affiliated Centre
              </span>
            </div>
          )}

          {/* Type Badge Floating */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border backdrop-blur-md ${getTypeBadgeStyle(
                centre.centreType || centre.organizationType || 'Centre'
              )}`}
            >
              <Award className="w-3 h-3" />
              <span>{centre.centreType || centre.organizationType || 'Affiliated Centre'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3" />
              Affiliated
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          {/* Centre Name — Strongest Typography */}
          <Link href={detailUrl} className="block group-hover:text-amber-400 transition-colors">
            <h3 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide leading-tight line-clamp-2">
              {centre.name}
            </h3>
          </Link>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs text-slate-300 font-medium">
            {contactName && (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-slate-400 text-[11px] block leading-none mb-0.5">Contact Person</span>
                  <span className="text-slate-200 font-semibold text-sm">{contactName}</span>
                </div>
              </div>
            )}

            {rawPhone && (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block leading-none mb-0.5">Phone Number</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-white hover:text-amber-400 font-mono font-bold transition-colors text-sm tracking-wider"
                  >
                    {rawPhone}
                  </a>
                </div>
              </div>
            )}

            {centre.address && (
              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="line-clamp-2 text-slate-400 text-xs leading-relaxed">
                  {centre.address}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {rawPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
            title={`Call ${centre.name}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        ) : null}

        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-slate-700"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
