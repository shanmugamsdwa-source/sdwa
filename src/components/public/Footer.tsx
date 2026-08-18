import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { getAssociationSettings } from '@/lib/firebase/firestore';

export default async function Footer() {
  const settings = await getAssociationSettings();

  const phone = settings?.phone || '09944301212';
  const address = settings?.address || 'Shiv, Shaktinagar, Salem, Tamil Nadu 636201';
  const regNo = settings?.registrationNumber || '112 / 2020';

  const workingHours = settings?.workingHours && settings.workingHours.length > 0
    ? settings.workingHours
    : [
        { day: 'Sat', open: '06:00', close: '22:00' },
        { day: 'Sun', open: '06:30', close: '10:00' },
      ];

  const instagram =
    settings?.socialLinks?.instagram?.trim() ||
    'https://www.instagram.com/isha_gym_shanmugam?igsh=MnlneHF1ZG9wb2Ny';
  const facebook =
    settings?.socialLinks?.facebook?.trim() ||
    'https://www.facebook.com/share/14kUMAKhV4x';
  const youtube =
    settings?.socialLinks?.youtube?.trim() ||
    'https://youtube.com/@ishagym_salem_tn?si=gxU5QBkCYOTBjxYb';

  const hasSocials = Boolean(
    (instagram && instagram !== 'https://instagram.com') ||
    (facebook && facebook !== 'https://facebook.com') ||
    (youtube && youtube !== 'https://youtube.com')
  );

  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t-2 border-[#D97706] pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Identity & Affiliation */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Expanded Circular Gold-Bordered Placeholder */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.3)] flex items-center justify-center shrink-0 overflow-hidden">
                <div className="relative w-[90%] h-[90%]">
                  <Image
                    src="/images/sdwa-footer-logo.png"
                    alt="SDWA Official Emblem"
                    fill
                    className="object-contain"
                    sizes="128px"
                    priority
                  />
                </div>
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wider">SDWA</h3>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Salem District Weightlifting Association</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Salem District Weightlifting Association is the official sports federation dedicated to the development, coaching, and championship governance of Olympic weightlifting across Salem District.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-[11px] text-[#FCD34D] font-medium">
              <ShieldCheck size={14} className="text-[#22C55E]" />
              <span>Affiliated to Tamil Nadu State Weightlifting Association</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-oswald text-sm font-bold uppercase tracking-widest text-[#FCD34D] mb-4">
              Federation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Association &amp; Committee
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  Championship Achievements
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-white transition-colors">
                  Meets &amp; Entry Forms
                </Link>
              </li>
              <li>
                <Link href="/affiliated-centres" className="hover:text-white transition-colors">
                  Affiliated Centres
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Competition Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Working Hours
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Timings */}
          <div>
            <h4 className="font-oswald text-sm font-bold uppercase tracking-widest text-[#FCD34D] mb-4">
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#FCD34D] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#FCD34D] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white font-mono">{phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-[#FCD34D] shrink-0" />
                <span>Registration: {regNo}</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock size={12} className="text-[#FCD34D]" />
                <span>Training / Office Hours</span>
              </p>
              <p className="text-xs text-slate-400">
                {workingHours.map((wh) => `${wh.day}: ${wh.open} – ${wh.close}`).join(' | ')}
              </p>
            </div>
          </div>

          {/* Column 4: State Affiliation & Media */}
          <div>
            <h4 className="font-oswald text-sm font-bold uppercase tracking-widest text-[#FCD34D] mb-4">
              State Affiliation
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <p className="text-white font-semibold leading-snug">
                Tamil Nadu State Weightlifting Association
              </p>
              <p className="text-slate-400 text-[11px]">
                Recognized state governing body promoting national and international weightlifting talent.
              </p>
            </div>

            {hasSocials && (
              <div className="mt-5 space-y-2">
                <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Official Channels
                </p>
                <div className="flex items-center gap-3">
                  {instagram && instagram !== 'https://instagram.com' && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                      aria-label="Follow SDWA on Instagram"
                      title="Follow on Instagram"
                    >
                      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {facebook && facebook !== 'https://facebook.com' && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                      aria-label="Follow SDWA on Facebook"
                      title="Follow on Facebook"
                    >
                      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {youtube && youtube !== 'https://youtube.com' && (
                    <a
                      href={youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-[#FF0000] flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                      aria-label="Subscribe to SDWA on YouTube"
                      title="Subscribe on YouTube"
                    >
                      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Subfooter */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Salem District Weightlifting Association (SDWA). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#FCD34D]">Affiliated to TNSWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
