import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, Tournament, WeightDivision, WeightClass } from '@/types';
import { Swords, Scale } from 'lucide-react';
import TournamentsList from '@/components/public/TournamentsList';

export const metadata = {
  title: 'Championships, Entry Forms & Weight Classes | SDWA',
  description:
    'Official Salem District Weightlifting competition calendars, tournament entry forms, registration rules, weight divisions, and categories.',
};

export const revalidate = 60;

export default async function TournamentsPage() {
  let tournaments: Tournament[] = [];
  let divisions: WeightDivision[] = [];
  let weightClasses: WeightClass[] = [];

  try {
    const [tData, dData, wData] = await Promise.allSettled([
      getCollection<Tournament>(COLLECTIONS.TOURNAMENTS, { orderBy: 'createdAt', direction: 'desc' }),
      getCollection<WeightDivision>(COLLECTIONS.WEIGHT_DIVISIONS, { orderBy: 'displayOrder' }),
      getCollection<WeightClass>(COLLECTIONS.WEIGHT_CLASSES, { orderBy: 'displayOrder' }),
    ]);

    if (tData.status === 'fulfilled') tournaments = tData.value;
    if (dData.status === 'fulfilled') divisions = dData.value;
    if (wData.status === 'fulfilled') weightClasses = wData.value;
  } catch (error) {
    console.error('Tournaments page fetch error:', error);
  }

  return (
    <main className="space-y-20 py-16 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#DC2626] text-xs font-bold uppercase tracking-wider">
          <Swords size={14} />
          <span>Official Competition Schedule</span>
        </div>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[#0F172A] tracking-tight">
          Championships &amp; <span className="text-gold-gradient">Meets</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Official tournament schedules, eligibility guidelines, weigh-in details, and online entry form links.
        </p>
      </section>

      {/* Tournaments Filtered List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TournamentsList initialTournaments={tournaments} />
      </section>

      {/* Official Weight Categories Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl space-y-8">
          <div className="space-y-2">
            <span className="text-[#B45309] font-oswald text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Scale size={15} /> Competition Standards
            </span>
            <h2 className="font-oswald text-3xl font-bold uppercase text-[#0F172A]">
              Official Weight <span className="text-gold-gradient">Divisions &amp; Classes</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sanctioned competition weight brackets following State &amp; National Weightlifting Federation technical rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {divisions.length === 0 ? (
              [
                { name: 'Senior & Junior Men', weights: ['60 kg', '65 kg', '70 kg', '75 kg', '85 kg', '95 kg', '110 kg', '+110 kg'] },
                { name: 'Senior & Junior Women', weights: ['49 kg', '53 kg', '57 kg', '61 kg', '69 kg', '77 kg', '86 kg', '+86 kg'] },
                { name: 'Youth Boys (13–17)', weights: ['55 kg', '60 kg', '65 kg', '70 kg', '75 kg', '85 kg', '95 kg', '+95 kg'] },
                { name: 'Youth Girls (13–17)', weights: ['45 kg', '49 kg', '53 kg', '57 kg', '61 kg', '69 kg', '77 kg', '+77 kg'] },
              ].map((div, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h3 className="font-oswald text-base font-bold text-[#B45309] uppercase">{div.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {div.weights.map((w, j) => (
                      <span key={j} className="font-mono text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              divisions.map((div) => {
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
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
