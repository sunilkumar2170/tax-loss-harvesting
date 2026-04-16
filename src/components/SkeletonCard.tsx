const SkeletonCard = ({ blue = false }: { blue?: boolean }) => (
  <div
    className={`rounded-2xl p-5 sm:p-6 animate-pulse ${
      blue
        ? 'bg-gradient-to-br from-blue-600/30 to-blue-900/30 border border-blue-500/20'
        : 'bg-dark-700 border border-white/5'
    }`}
  >
    <div className="h-5 w-36 rounded bg-white/10 mb-6" />
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-3 w-20 rounded bg-white/10" />
      <div className="h-3 w-20 rounded bg-white/10" />
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} className="flex justify-between mb-3">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/10 ml-4" />
        <div className="h-4 w-16 rounded bg-white/10 ml-4" />
      </div>
    ))}
    <div className="mt-6 h-px bg-white/10" />
    <div className="mt-4 flex justify-between">
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="h-6 w-24 rounded bg-white/10" />
    </div>
  </div>
);

export default SkeletonCard;
