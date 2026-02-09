export default function MvdIndicator({ todayHabits, completedIds }) {
  const mvdHabits = todayHabits.filter(h => h.mvd)
  const mvdDone = mvdHabits.filter(h => completedIds.includes(h.id)).length
  const allDone = mvdDone === mvdHabits.length && mvdHabits.length > 0

  if (mvdHabits.length === 0) return null

  return (
    <div className={`px-4 py-3 rounded-xl transition-all duration-300 ${
      allDone
        ? 'glass-light ring-1 ring-emerald-500/30 glow-emerald'
        : 'glass-light ring-1 ring-white/5'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">MVD</span>
          <span className="text-[10px] text-white/25">Minimum Viable Day</span>
        </div>
        <span className={`text-sm font-mono ${allDone ? 'text-emerald-400' : 'text-white/30'}`}>
          {mvdDone}/{mvdHabits.length}
        </span>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {mvdHabits.map(h => (
          <span
            key={h.id}
            className={`text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200 ${
              completedIds.includes(h.id)
                ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
                : 'bg-white/5 text-white/30 ring-1 ring-white/5'
            }`}
          >
            {h.name.length > 25 ? h.name.slice(0, 25) + '...' : h.name}
          </span>
        ))}
      </div>
    </div>
  )
}
