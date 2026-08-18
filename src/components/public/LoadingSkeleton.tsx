import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-300 rounded w-4/5" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-96 bg-slate-900 animate-pulse flex flex-col justify-center items-center p-6 text-center">
      <div className="h-4 bg-amber-500/40 rounded w-32 mb-4" />
      <div className="h-10 bg-slate-800 rounded w-3/4 max-w-xl mb-3" />
      <div className="h-6 bg-slate-800 rounded w-1/2 max-w-md mb-6" />
      <div className="flex gap-4">
        <div className="h-10 bg-amber-600/40 rounded w-36" />
        <div className="h-10 bg-slate-800 rounded w-36" />
      </div>
    </div>
  );
}
