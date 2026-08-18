export default function PublicLoading() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 mx-auto border-4 border-amber-200 border-t-[#B45309] rounded-full animate-spin" />
        <p className="font-oswald text-sm font-bold uppercase tracking-widest text-slate-400">
          Loading SDWA...
        </p>
      </div>
    </main>
  );
}
