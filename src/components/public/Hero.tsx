import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Swords, ShieldCheck, ChevronRight, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-gradient-to-b from-[#FFFDF8] via-[#F8FAFC] to-[#F1F5F9]">
      {/* Light Background Aura */}
      <div className="absolute inset-0 bg-radial-glow-light pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern-light opacity-50 pointer-events-none" />
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-36 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Affiliation Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300 shadow-sm text-xs font-semibold text-slate-800 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
              <span className="text-[#92400E]">ESTD 2020</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">REG NO: 112 / 2020</span>
            </div>

            {/* Main Title */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#D97706]">
                Official District Governing Body
              </p>
              <h1 className="font-oswald text-4xl sm:text-6xl xl:text-7xl font-bold uppercase tracking-tight text-[#0F172A] leading-[1.05]">
                Salem District <br />
                <span className="text-gold-gradient">Weightlifting</span> Association
              </h1>
            </div>

            {/* Affiliation Line */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-[#92400E] font-semibold">
              <ShieldCheck size={18} className="text-[#15803D] shrink-0" />
              <span>Affiliated to Tamil Nadu State Weightlifting Association</span>
            </div>

            {/* Motto */}
            <div className="py-1">
              <p className="font-oswald text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-wide">
                Building Strength. <span className="text-[#DC2626]">Creating Champions.</span>
              </p>
              <p className="text-sm text-slate-600 max-w-xl mx-auto lg:mx-0 mt-2 leading-relaxed">
                Dedicated to Olympic-style weightlifting development across Salem district, conducting sanctioned championships, and nurturing medal-winning athletes.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/achievements"
                className="btn-gold w-full sm:w-auto px-7 py-3.5 rounded-xl font-oswald text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              >
                <Award size={18} />
                <span>VIEW ACHIEVEMENTS</span>
              </Link>

              <Link
                href="/tournaments"
                className="btn-crimson w-full sm:w-auto px-7 py-3.5 rounded-xl font-oswald text-sm font-bold tracking-wider flex items-center justify-center gap-2 group shadow-md hover:shadow-lg transition"
              >
                <Swords size={18} />
                <span>UPCOMING TOURNAMENTS</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Genuine Transparent SDWA Medallion */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 xl:w-[420px] xl:h-[420px] flex items-center justify-center">
              {/* Outer Decorative Rings */}
              <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-spin [animation-duration:45s]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-red-300/40" />

              {/* Medallion Image */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 drop-shadow-2xl">
                <Image
                  src="/images/sdwa-logo.png"
                  alt="Salem District Weightlifting Association Official Crest"
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 1280px) 320px, 384px"
                  priority
                  className="object-contain"
                />
              </div>

              {/* Floating Stat Badge Left */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-0 bg-white px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl border border-amber-200">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
                  <Trophy size={20} />
                </div>
                <div className="text-left">
                  <p className="font-oswald text-lg font-bold text-[#0F172A] leading-none">50+ Medals</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">State &amp; National</p>
                </div>
              </div>

              {/* Floating Stat Badge Right */}
              <div className="absolute -top-2 -right-2 sm:top-4 sm:right-0 bg-white px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl border border-amber-200">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-[#15803D]">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <p className="font-oswald text-lg font-bold text-[#0F172A] leading-none">17 Academies</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Salem District</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
