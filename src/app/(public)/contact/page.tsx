import { getAssociationSettings } from '@/lib/firebase/firestore';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import ContactForm from '@/components/public/ContactForm';

export const metadata = {
  title: 'Contact SDWA & Headquarters Location | SDWA',
  description:
    'Contact Salem District Weightlifting Association (SDWA) headquarters, official working hours schedule, and Google Maps location.',
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getAssociationSettings();

  const phone = settings?.phone || '09944301212';
  const email = settings?.email || 'shanmugamsdwa@gmail.com';
  const address = settings?.address || 'Shiv, Shaktinagar, Salem, Tamil Nadu 636201';
  const workingHours = settings?.workingHours && settings.workingHours.length > 0
    ? settings.workingHours
    : [
        { day: 'Saturday', open: '06:00', close: '22:00', note: 'Hours might differ' },
        { day: 'Sunday', open: '06:30', close: '10:00' },
        { day: 'Monday – Friday', open: '06:00', close: '21:00' },
      ];

  return (
    <main className="space-y-16 py-16 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={14} />
          <span>Official Secretariat</span>
        </div>
        <h1 className="font-oswald text-4xl sm:text-6xl font-bold uppercase text-[#0F172A] tracking-tight">
          Contact <span className="text-gold-gradient">SDWA</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Reach out to the Salem District Weightlifting Association for affiliation queries, tournament entries, and coaching certifications.
        </p>
      </section>

      {/* Main Grid: Contact Info, Working Hours, Form & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Headquarters Details & Working Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-md space-y-6">
              <h2 className="font-oswald text-2xl font-bold uppercase text-[#0F172A]">
                Federation Secretariat
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] uppercase text-xs">Office Address</p>
                    <p className="text-slate-600 mt-0.5 font-medium">{address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-[#15803D] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] uppercase text-xs">Official Phone</p>
                    <a href={`tel:${phone}`} className="text-slate-700 hover:text-slate-900 font-mono font-semibold">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] uppercase text-xs">Official Email</p>
                    <a href={`mailto:${email}`} className="text-slate-700 hover:text-slate-900 font-semibold truncate">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706] shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] uppercase text-xs">Affiliation &amp; Registration</p>
                    <p className="text-slate-600 font-medium">TNSWA Affiliated &bull; Reg No: 112 / 2020</p>
                  </div>
                </div>
              </div>

              {/* Working Hours Schedule */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="font-oswald text-sm font-bold uppercase text-[#B45309] flex items-center gap-2">
                  <Clock size={16} /> Official Operating Hours
                </h3>
                <div className="space-y-2">
                  {workingHours.map((wh, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                      <span className="font-bold text-slate-800">{wh.day}</span>
                      <span className="font-mono text-[#B45309] font-bold">{wh.open} – {wh.close}</span>
                      {wh.note && <span className="text-[10px] text-slate-500 font-normal">({wh.note})</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Social Media Channels */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="font-oswald text-sm font-bold uppercase text-[#0F172A] flex items-center gap-2">
                  Follow &amp; Subscribe Online
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={settings?.socialLinks?.instagram || "https://www.instagram.com/isha_gym_shanmugam?igsh=MnlneHF1ZG9wb2Ny"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300 transition text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-currentColor shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href={settings?.socialLinks?.facebook || "https://www.facebook.com/share/14kUMAKhV4x"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-currentColor shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                  <a
                    href={settings?.socialLinks?.youtube || "https://youtube.com/@ishagym_salem_tn?si=gxU5QBkCYOTBjxYb"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-currentColor shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form & Google Maps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Resend Contact Form */}
            <ContactForm />

            {/* Google Maps Embed */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 overflow-hidden shadow-md">
              <iframe
                title="ISHA GYM Weightlifting Sports Academy - SDWA Headquarters Map"
                src={settings?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.9050662374866!2d78.13689007010963!3d11.630114717643819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babefd6fceb62a3%3A0xf3581da1e2038658!2sISHA%20GYM%20Weightlifting%20sports%20academy!5e0!3m2!1sen!2sin!4v1786905574773!5m2!1sen!2sin"}
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: '1.25rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
