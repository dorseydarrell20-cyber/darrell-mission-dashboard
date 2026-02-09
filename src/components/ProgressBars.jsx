export default function ProgressBars({ habitsComplete, habitsTotal, xpEarned, xpPossibleMax, keystoneBonus }) {
  const habitPct = habitsTotal > 0 ? (habitsComplete / habitsTotal) * 100 : 0
  const xpPct = xpPossibleMax > 0 ? (xpEarned / xpPossibleMax) * 100 : 0

  return (
    <div className="space-y-3">
      {/* Habits bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40 font-medium tracking-wide uppercase text-[10px]">Habits</span>
          <span className="text-white/60 font-mono text-[11px]">{habitsComplete}/{habitsTotal}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/5">
          <div
            className="h-full rounded-full animate-fill transition-all duration-500"
            style={{
              width: `${Math.min(habitPct, 100)}%`,
              background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
            }}
          />
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40 font-medium tracking-wide uppercase text-[10px]">
            XP{keystoneBonus && <span className="text-amber-400 ml-1.5 normal-case">1.5x</span>}
          </span>
          <span className="text-white/60 font-mono text-[11px]">{xpEarned}/{xpPossibleMax}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/5">
          <div
            className={`h-full rounded-full animate-fill transition-all duration-500 ${
              keystoneBonus ? 'bar-shimmer' : ''
            }`}
            style={{
              width: `${Math.min(xpPct, 100)}%`,
              background: keystoneBonus
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
