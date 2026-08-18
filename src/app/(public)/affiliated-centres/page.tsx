import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, AffiliatedCentre } from '@/types';
import { ShieldCheck, PhoneCall, ArrowRight, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';
import CentresList from '@/components/public/CentresList';

export const metadata = {
  title: 'Affiliated Centres | Salem District Weightlifting Association',
  description:
    'Gyms, weightlifting academies, sports academies and educational institutions associated with the Salem District Weightlifting Association.',
  openGraph: {
    title: 'Our Affiliated Centres | SDWA',
    description:
      'Gyms, weightlifting academies, sports academies and educational institutions associated with the Salem District Weightlifting Association.',
    images: ['/images/sdwa-logo.png'],
  },
};

export const dynamic = 'force-dynamic';

export default async function AffiliatedCentresPage() {
  let centres: AffiliatedCentre[] = [];

  try {
    const rawCentres = await getCollection<AffiliatedCentre>(
      COLLECTIONS.AFFILIATED_CENTRES,
      {
        orderBy: 'displayOrder',
      }
    );

    // Filter published only (also support isActive for legacy documents)
    centres = rawCentres.filter((c) => c.isPublished !== false && c.isActive !== false);
  } catch (error) {
    console.error('Affiliated centres page fetch error:', error);
  }

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-100 py-16 sm:py-20 space-y-16">
      {/* PAGE HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">
          <ShieldCheck size={15} className="text-amber-400" />
          <span>Sanctioned Training Centers</span>
        </div>

        <h1 className="font-oswald text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase text-white tracking-tight leading-none">
          Our Affiliated <span className="text-amber-400">Centres</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          Gyms, weightlifting academies, sports academies and educational institutions associated with the Salem District Weightlifting Association.
        </p>
      </section>

      {/* DIRECTORY LIST & FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CentresList initialCentres={centres} />
      </section>

      {/* CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-200">
              Affiliation &amp; Sanctioning
            </span>
            <h2 className="font-oswald text-2xl sm:text-4xl font-bold uppercase text-white tracking-tight">
              Register Your Centre with SDWA
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
              Are you managing a gym, fitness centre, academy, or collegiate weightlifting facility in Salem District? Get officially affiliated to participate in district championships and state qualifiers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:09944301212"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-amber-100 font-bold uppercase tracking-wider text-xs transition shadow-xl"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Call Secretariat</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 text-white font-bold uppercase tracking-wider text-xs transition border border-white/20 shadow-xl"
            >
              <span>Contact Association</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
