import Link from 'next/link';
import { Tournament, computeRegistrationState } from '@/types';
import { Calendar, MapPin, ExternalLink, Trophy, AlertCircle, Clock, Info } from 'lucide-react';
import { formatDisplayDate, formatDisplayDateTime } from '@/lib/utils/formatDate';

interface Props {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: Props) {
  const regState = computeRegistrationState(tournament);
  const detailUrl = `/tournaments/${(tournament as any).slug || tournament.id}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl relative overflow-hidden">
      {/* Top Status Banner */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {regState === 'APPLY_NOW' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping" />
            Registration Open
          </span>
        ) : regState === 'DEADLINE_PASSED' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <Clock size={12} className="text-amber-600" />
            Application Deadline Over
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            <AlertCircle size={12} />
            Registration Closed
          </span>
        )}

        <span className="font-mono text-xs text-slate-500 font-semibold">
          {formatDisplayDate(tournament.startDate)}
        </span>
      </div>

      {/* Meet Title & Info */}
      <div className="space-y-3">
        <Link href={detailUrl} className="block">
          <h3 className="font-oswald text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors leading-snug">
            {tournament.title}
          </h3>
        </Link>

        {tournament.venue && (
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <MapPin size={14} className="text-[#DC2626] shrink-0" />
            <span className="truncate">{tournament.venue}</span>
          </div>
        )}

        {tournament.description && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {tournament.description}
          </p>
        )}
      </div>

      {/* Footer Registration Action */}
      <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {tournament.registrationDeadline && (
          <div className="text-[11px]">
            <span className="text-slate-400 block font-medium">Application Deadline</span>
            <span className={`font-semibold ${regState === 'DEADLINE_PASSED' ? 'text-amber-800' : 'text-slate-700'}`}>
              {formatDisplayDateTime(tournament.registrationDeadline)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Link
            href={detailUrl}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            title="View Meet Details & Weight Classes"
          >
            <Info size={13} />
            <span>Details</span>
          </Link>

          {regState === 'APPLY_NOW' && tournament.registrationUrl ? (
            <a
              href={tournament.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shrink-0 shadow-sm hover:shadow"
            >
              <span>Apply Now</span>
              <ExternalLink size={12} />
            </a>
          ) : regState === 'DEADLINE_PASSED' ? (
            <span
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1 cursor-not-allowed shrink-0"
              title="Tournament application deadline has ended"
            >
              <Clock size={12} />
              <span>Deadline Over</span>
            </span>
          ) : (
            <span
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200 inline-flex items-center gap-1 cursor-not-allowed shrink-0"
            >
              <span>Closed</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
