'use client';

import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC] py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] mx-auto">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-red-600 font-mono text-xs font-bold uppercase tracking-widest block">
            System Error
          </span>
          <h1 className="font-oswald text-3xl font-bold uppercase text-[#0F172A] tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            An unexpected error occurred while loading this page. Please retry or return to the homepage.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            <Home size={14} />
            <span>Go Home</span>
          </a>
        </div>
      </div>
    </main>
  );
}
