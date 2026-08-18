import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBySlugOrId } from '@/lib/firebase/firestore';
import { COLLECTIONS, AffiliatedCentre } from '@/types';
import { Dumbbell, MapPin, Phone, Mail, User, Globe, ArrowLeft, ShieldCheck, Award, ExternalLink, PhoneCall } from 'lucide-react';

interface CentreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CentreDetailPageProps) {
  const { slug } = await params;
  const centre = await getBySlugOrId<AffiliatedCentre>(COLLECTIONS.AFFILIATED_CENTRES, slug);

  if (!centre) {
    return {
      title: 'Affiliated Centre Not Found | SDWA',
    };
  }

  const title = `${centre.name} | SDWA Affiliated Centre`;
  const description =
    centre.description ||
    `Official directory profile, contact person, and facility information for ${centre.name}, affiliated with Salem District Weightlifting Association.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: centre.imageUrl || centre.logoUrl ? [centre.imageUrl || centre.logoUrl!] : ['/images/sdwa-logo.png'],
    },
  };
}

export default async function CentreDetailPage({ params }: CentreDetailPageProps) {
  const { slug } = await params;
  const centre = await getBySlugOrId<AffiliatedCentre>(COLLECTIONS.AFFILIATED_CENTRES, slug);

  if (!centre) {
    notFound();
  }

  const contactName = centre.contactPerson || centre.coachName;
  const imageSrc = centre.imageUrl || centre.logoUrl;
  const rawPhone = centre.phone || '';
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const rawSecondary = centre.secondaryPhone || '';
  const cleanSecondary = rawSecondary.replace(/\s+/g, '');

  return (
    <main className="min-h-screen py-16 sm:py-20 bg-[#0b1120] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/affiliated-centres"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-amber-400 transition font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Affiliated Centres</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-[#1e293b] rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Logo / Image Column */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border border-amber-500/20 shadow-xl bg-slate-900 flex items-center justify-center p-4">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={centre.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                      <Dumbbell className="w-8 h-8" />
                    </div>
                    <p className="font-oswald text-xs font-bold uppercase text-slate-400">Affiliated Centre</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Type Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {centre.centreType || centre.organizationType || 'Affiliated Centre'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SDWA Sanctioned
                </span>
              </div>

              {/* Title */}
              <h1 className="font-oswald text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight">
                {centre.name}
              </h1>

              {/* Contact Person Attribution */}
              {contactName && (
                <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>
                    Contact Person:{' '}
                    <strong className="text-white font-bold">{contactName}</strong>
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {rawPhone && (
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call {rawPhone}</span>
                  </a>

                  {rawSecondary && (
                    <a
                      href={`tel:${cleanSecondary}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition border border-slate-700"
                    >
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>Alt: {rawSecondary}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs sm:text-sm">
                {centre.address && (
                  <div className="flex items-start gap-2.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{centre.address}</span>
                  </div>
                )}

                {centre.email && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={`mailto:${centre.email}`} className="hover:text-amber-400 font-semibold truncate">
                      {centre.email}
                    </a>
                  </div>
                )}

                {centre.websiteUrl && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                    <a
                      href={centre.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 font-semibold truncate flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section (only if exists) */}
          {centre.description && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-amber-400">
                Centre Overview &amp; Training Details
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {centre.description}
              </p>
            </div>
          )}

          {/* Google Maps Embed (only if exists) */}
          {centre.googleMapsUrl && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                <span>Location &amp; Training Facility</span>
              </h3>
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <iframe
                  src={centre.googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${centre.name} Map Location`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
