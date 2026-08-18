import Image from 'next/image';
import CommitteeCard from '@/components/public/CommitteeCard';
import ObjectivesSection from '@/components/public/ObjectivesSection';
import SportingObjectivesSection from '@/components/public/SportingObjectivesSection';
import CommitmentSection from '@/components/public/CommitmentSection';
import { getCollection } from '@/lib/firebase/firestore';
import { COLLECTIONS, CommitteeMember, AssociationObjective } from '@/types';
import { INITIAL_OFFICIAL_OBJECTIVES } from '@/lib/constants/objectives';
import { INITIAL_OFFICIAL_COMMITTEE } from '@/lib/constants/committee';
import { ShieldCheck, Target, Eye, Users } from 'lucide-react';

export const metadata = {
  title: 'About Association & Committee',
  description:
    'Learn about Salem District Weightlifting Association (SDWA), our state affiliation to TNSWA, official objectives, sporting focus, non-profit public service, mission, vision, and executive committee leadership.',
};

export default async function AboutPage() {
  let committee: CommitteeMember[] = [];
  let fetchedObjectives: AssociationObjective[] = [];

  try {
    const [comData, objData] = await Promise.allSettled([
      getCollection<CommitteeMember>(COLLECTIONS.COMMITTEE_MEMBERS, {
        orderBy: 'displayOrder',
      }),
      getCollection<AssociationObjective>(COLLECTIONS.ASSOCIATION_OBJECTIVES, {
        orderBy: 'displayOrder',
      }),
    ]);

    if (comData.status === 'fulfilled') committee = JSON.parse(JSON.stringify(comData.value));
    if (objData.status === 'fulfilled') fetchedObjectives = JSON.parse(JSON.stringify(objData.value));
  } catch (error) {
    console.error('About page data fetch error:', error);
  }

  // Filter published objectives, or use initial official defaults if none stored yet
  const publishedObjectives = fetchedObjectives.filter((o) => o.isPublished !== false);

  const coreObjectives = (
    publishedObjectives.filter((o) => o.category === 'core_objective').length > 0
      ? publishedObjectives.filter((o) => o.category === 'core_objective')
      : INITIAL_OFFICIAL_OBJECTIVES.filter((o) => o.category === 'core_objective').map((o, idx) => ({
          ...o,
          id: `seed-core-${idx + 1}`,
        }))
  ) as AssociationObjective[];

  const sportingObjectives = (
    publishedObjectives.filter((o) => o.category === 'sporting_objective').length > 0
      ? publishedObjectives.filter((o) => o.category === 'sporting_objective')
      : INITIAL_OFFICIAL_OBJECTIVES.filter((o) => o.category === 'sporting_objective').map((o, idx) => ({
          ...o,
          id: `seed-sporting-${idx + 1}`,
        }))
  ) as AssociationObjective[];

  const commitments = (
    publishedObjectives.filter((o) => o.category === 'commitment').length > 0
      ? publishedObjectives.filter((o) => o.category === 'commitment')
      : INITIAL_OFFICIAL_OBJECTIVES.filter((o) => o.category === 'commitment').map((o, idx) => ({
          ...o,
          id: `seed-commitment-${idx + 1}`,
        }))
  ) as AssociationObjective[];

  return (
    <main className="space-y-24 py-16 bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={14} />
          <span>Official Federation Background</span>
        </div>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[#0F172A] tracking-tight">
          About <span className="text-gold-gradient">SDWA</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          The governing body fostering Olympic weightlifting talent, standard training academies, and championship platforms across Salem District.
        </p>
      </section>

      {/* Federation Identity & Affiliation Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 drop-shadow-2xl">
                <Image
                  src="/images/sdwa-logo.png"
                  alt="SDWA Official Emblem"
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase text-[#0F172A]">
                Salem District Weightlifting Association
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase font-mono text-[10px] font-semibold">Affiliation</span>
                  <span className="font-bold text-[#B45309]">Tamil Nadu State Weightlifting Association</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase font-mono text-[10px] font-semibold">Registration Number</span>
                  <span className="font-bold text-slate-900">112 / 2020</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase font-mono text-[10px] font-semibold">Headquarters</span>
                  <span className="font-bold text-slate-900">Shiv, Shaktinagar, Salem - 636201</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase font-mono text-[10px] font-semibold">Governing Scope</span>
                  <span className="font-bold text-[#15803D]">17 Certified Academies &amp; Gyms</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-2 font-medium">
                Under the guidance of the Tamil Nadu State Weightlifting Association, SDWA organizes district championships, maintains official ranking records, conducts training camps, and certifies coaches and gyms throughout Salem district.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. OUR OBJECTIVES (6 Core Objectives) */}
      <ObjectivesSection objectives={coreObjectives} />

      {/* 2. OUR SPORTING OBJECTIVES (3 Objectives) */}
      <SportingObjectivesSection objectives={sportingObjectives} />

      {/* 3. OUR COMMITMENT (2 Organizational Principles) */}
      <CommitmentSection commitments={commitments} />


      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
              <Target size={24} />
            </div>
            <h3 className="font-oswald text-2xl font-bold uppercase text-[#0F172A]">Our Mission</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              To identify, train, and support grassroots athletic talent across Salem District; providing scientific coaching, standard barbell equipment, tournament exposure, and financial welfare for lifters to excel at State, National, and International championships.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
              <Eye size={24} />
            </div>
            <h3 className="font-oswald text-2xl font-bold uppercase text-[#0F172A]">Our Vision</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              To establish Salem District as the premier hub for weightlifting excellence in Tamil Nadu and India, producing Olympic-caliber athletes, certified coaches, and fair competition standards.
            </p>
          </div>
        </div>
      </section>

      {/* Executive Committee Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="committee">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#B45309] font-oswald text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Users size={16} /> Official Board
          </span>
          <h2 className="font-oswald text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight">
            Executive <span className="text-gold-gradient">Committee</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Office Bearers &amp; Executive Members of the Salem District Weightlifting Association
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(committee.length > 0
            ? committee
            : INITIAL_OFFICIAL_COMMITTEE.map((m, i) => ({
                ...m,
                id: `init-member-${i + 1}`,
              }))
          ).map((member) => (
            <CommitteeCard key={member.id} member={member as CommitteeMember} />
          ))}
        </div>
      </section>
    </main>
  );
}
