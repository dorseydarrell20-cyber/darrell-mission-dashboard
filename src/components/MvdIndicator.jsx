export default function MvdIndicator({ todayHabits, completedIds }) {
  const mvdHabits = todayHabits.filter(h => h.mvd)
  const mvdDone = mvdHabits.filter(h => completedIds.includes(h.id)).length
  const allDone = mvdDone === mvdHabits.length && mvdHabits.length > 0

  if (mvdHabits.length === 0) return null

  return (
    <div className={`px-3 py-2 rounded-lg border ${
      allDone ? 'border-emerald-800 bg-emerald-950/50' : 'border-gray-800 bg-gray-900/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">MVD</span>
          <span className="text-xs text-gray-500">Minimum Viable Day</span>
        </div>
        <span className={`text-sm font-mono ${allDone ? 'text-emerald-400' : 'text-gray-500'}`}>
          {mvdDone}/{mvdHabits.length}
        </span>
      </div>
      <div className="flex gap-2 mt-1.5">
        {mvdHabits.map(h => (
          <span
            key={h.id}
            className={`text-xs px-2 py-0.5 rounded ${
              completedIds.includes(h.id)
                ? 'bg-emerald-900/50 text-emerald-400'
                : 'bg-gray-800 text-gray-500'
            }`}
          >
            {h.name.length > 30 ? h.name.slice(0, 30) + '...' : h.name}
          </span>
        ))}
      </div>
    </div>
  )
}
