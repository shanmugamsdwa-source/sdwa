import Link from 'next/link';
import { AffiliatedInstitution, ORGANIZATION_TYPE_LABELS } from '@/types';
import { Dumbbell, MapPin, Phone, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  institution: AffiliatedInstitution;
}

export default function InstitutionCard({ institution }: Props) {
  const detailUrl = `/institutions/${institution.slug || institution.id}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl">
      <div>
        {/* Type Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
            <Dumbbell size={12} className="text-[#D97706]" />
            {institution.centreType || (institution.organizationType ? ORGANIZATION_TYPE_LABELS[institution.organizationType] || institution.organizationType : 'Affiliated Centre')}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
            <ShieldCheck size={13} />
            Affiliated
          </span>
        </div>

        {/* Institution Name */}
        <Link href={detailUrl} className="block">
          <h3 className="font-oswald text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors leading-snug">
            {institution.name}
          </h3>
        </Link>

        {/* Coach / Details */}
        <div className="space-y-2 mt-4 text-xs text-slate-600 font-medium">
          {institution.coachName && (
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#D97706] shrink-0" />
              <span className="text-slate-800 font-semibold">Head Coach: {institution.coachName}</span>
            </div>
          )}

          {institution.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#15803D] shrink-0" />
              <a href={`tel:${institution.phone}`} className="hover:text-slate-900 transition-colors font-mono">
                {institution.phone}
              </a>
            </div>
          )}

          {institution.address && (
            <div className="flex items-start gap-2 pt-1">
              <MapPin size={14} className="text-[#DC2626] shrink-0 mt-0.5" />
              <span className="line-clamp-2 text-slate-500">{institution.address}</span>
            </div>
          )}
        </div>
      </div>

      {institution.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mt-4 pt-3 border-t border-slate-100">
          {institution.description}
        </p>
      )}

      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
        <Link
          href={detailUrl}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-700 hover:text-amber-700 transition"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <span className="text-[10px] text-slate-400 font-mono">ESTD Certified</span>
      </div>
    </div>
  );}
