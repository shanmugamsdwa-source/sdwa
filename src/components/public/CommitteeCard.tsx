import { CommitteeMember } from '@/types';
import { Shield } from 'lucide-react';
import Image from 'next/image';

interface Props {
  member: CommitteeMember;
}

export default function CommitteeCard({ member }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-amber-200 hover:border-amber-400 transition-all duration-300 flex flex-col items-center text-center group shadow-sm hover:shadow-xl">
      {/* Member Avatar */}
      <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-4 bg-amber-50 border-2 border-amber-300 shadow-sm flex items-center justify-center">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="font-oswald text-3xl font-bold text-[#92400E] select-none">
              {(member.name || '')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0].toUpperCase())
                .join('')}
            </span>
          </div>
        )}
      </div>

      {/* Name & Designation */}
      <h3 className="font-oswald text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors">
        {member.name}
      </h3>

      <p className="text-xs font-bold uppercase tracking-widest text-[#B45309] mt-1 mb-2">
        {member.designation || member.position}
      </p>

      {member.description && (
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2 pt-2 border-t border-slate-100 w-full">
          {member.description}
        </p>
      )}

      <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-[#15803D] font-bold">
        <Shield size={12} />
        <span>Executive Committee</span>
      </div>
    </div>
  );
}
