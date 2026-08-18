import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A]">
        <main className="min-h-screen flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] mx-auto">
              <ShieldAlert size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-red-600 font-mono text-xs font-bold uppercase tracking-widest block">
                Error Code 404
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold uppercase text-[#0F172A] tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Page Not Found
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                The requested page does not exist or has been moved.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                <Home size={14} />
                <span>Go to Homepage</span>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
