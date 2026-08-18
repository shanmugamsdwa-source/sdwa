import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBySlugOrId, getCollection, getDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS, Tournament, WeightDivision, WeightClass, AchievementLevel } from '@/types';
import { Swords, Calendar, MapPin, Scale, Clock, ExternalLink, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toSafeDate, formatDisplayDate, formatDisplayDateTime } from '@/lib/utils/formatDate';

interface TournamentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: TournamentDetailPageProps) {
  const { slug } = await params;
  const tournament = await getBySlugOrId<Tournament>(COLLECTIONS.TOURNAMENTS, slug);

  if (!tournament) {
    return {
      title: 'Championship Not Found | SDWA',
    };
  }

  return {
    title: `${tournament.title} | SDWA Championships`,
    description: tournament.description || `Official tournament details, registration rules, and weight classes for ${tournament.title}`,
    openGraph: {
      title: `${tournament.title} | SDWA`,
      description: tournament.description,
      images: tournament.posterUrl ? [tournament.posterUrl] : ['/images/sdwa-logo.png'],
    },
  };
}

export default async function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  const { slug } = await params;
  const tournament = await getBySlugOrId<Tournament>(COLLECTIONS.TOURNAMENTS, slug);

  if (!tournament) {
    notFound();
  }

  // Fetch divisions, weight classes, and level
  let divisions: WeightDivision[] = [];
  let weightClasses: WeightClass[] = [];
  let level: AchievementLevel | null = null;

  try {
    const [dData, wData] = await Promise.allSettled([
      getCollection<WeightDivision>(COLLECTIONS.WEIGHT_DIVISIONS, { orderBy: 'displayOrder' }),
      getCollection<WeightClass>(COLLECTIONS.WEIGHT_CLASSES, { orderBy: 'displayOrder' }),
    ]);
    if (dData.status === 'fulfilled') divisions = dData.value;
    if (wData.status === 'fulfilled') weightClasses = wData.value;

    if (tournament.levelId) {
      level = await getDocument<AchievementLevel>(COLLECTIONS.ACHIEVEMENT_LEVELS, tournament.levelId);
    }
  } catch (error) {
    console.error('Error fetching divisions for tournament:', error);
  }

  const now = new Date();
  const deadlineDate = toSafeDate(tournament.registrationDeadline);
  const isDeadlinePassed = deadlineDate ? deadlineDate < now : false;
  const isRegistrationOpen = tournament.registrationStatus === 'OPEN' && !isDeadlinePassed;

  return (
    <main className="min-h-screen py-16 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Championships Schedule</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Poster / Logo Column */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full aspect-[3/4] max-w-xs rounded-2xl overflow-hidden border border-slate-200 shadow bg-slate-100 flex items-center justify-center">
                {tournament.posterUrl ? (
                  <Image
                    src={tournament.posterUrl}
                    alt={tournament.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <Swords className="w-12 h-12 text-amber-600 mx-auto" />
                    <p className="font-oswald text-sm font-bold uppercase text-slate-400">Official Meet Poster</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {level && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {level.name}
                  </span>
                )}
                {isRegistrationOpen ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span>Registration Open</span>
                  </span>
                ) : isDeadlinePassed ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                    <Clock size={13} className="text-amber-600" />
                    <span>Application Deadline Over</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    Registration Closed
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-oswald text-3xl sm:text-5xl font-bold uppercase text-[#0F172A] tracking-tight leading-tight">
                {tournament.title}
              </h1>

              {/* Details Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Competition Dates</span>
                    <span className="font-semibold text-slate-800">
                      {formatDisplayDate(tournament.startDate)}
                      {tournament.endDate && ` – ${formatDisplayDate(tournament.endDate)}`}
                    </span>
                  </div>
                </div>

                {tournament.venue && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue &amp; Platform</span>
                      <span className="font-semibold text-slate-800">{tournament.venue}</span>
                    </div>
                  </div>
                )}

                {tournament.registrationDeadline && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Deadline</span>
                      <span className={`font-semibold ${isDeadlinePassed ? 'text-amber-900 font-bold' : 'text-slate-800'}`}>
                        {formatDisplayDateTime(tournament.registrationDeadline)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioning</span>
                    <span className="font-semibold text-green-700">TNSWA &amp; SDWA Sanctioned</span>
                  </div>
                </div>
              </div>

              {/* Registration CTA Button / Notice */}
              <div className="pt-4">
                {isRegistrationOpen && tournament.registrationUrl ? (
                  <a
                    href={tournament.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-crimson inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-oswald text-sm font-bold tracking-wider shadow-lg hover:shadow-xl transition"
                  >
                    <span>APPLY NOW (ENTRY FORM)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : isDeadlinePassed ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 font-oswald text-sm font-bold uppercase tracking-wider text-amber-900">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Tournament Application Deadline Has Ended</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      The official entry submission window for this championship closed on <strong>{formatDisplayDateTime(tournament.registrationDeadline)}</strong>. You can still review the competition schedule, guidelines, and sanctioned weight classes below.
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-oswald text-sm font-bold uppercase border border-slate-200 cursor-not-allowed">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span>REGISTRATION CLOSED</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description / Rules */}
          {tournament.description && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-slate-900 mb-3">
                Championship Guidelines &amp; Technical Rules
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {tournament.description}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Weight Categories Selected for This Tournament */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-md space-y-6">
          <div className="space-y-1">
            <span className="text-[#B45309] font-oswald text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Scale size={15} /> Divisions
            </span>
            <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase text-[#0F172A]">
              Sanctioned Weight Classes for this Meet
            </h2>
            <p className="text-xs text-slate-500">
              Lifters must weigh in strictly within their registered category during the official weigh-in session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {divisions.map((div) => {
              const classesInDiv = weightClasses.filter((wc) => wc.divisionId === div.id);
              return (
                <div key={div.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h3 className="font-oswald text-base font-bold text-[#B45309] uppercase">{div.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {classesInDiv.map((wc) => (
                      <span key={wc.id} className="font-mono text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                        {wc.displayValue}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
