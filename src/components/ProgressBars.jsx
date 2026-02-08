export default function ProgressBars({ habitsComplete, habitsTotal, xpEarned, xpPossibleMax, keystoneBonus }) {
  const habitPct = habitsTotal > 0 ? (habitsComplete / habitsTotal) * 100 : 0
  const xpPct = xpPossibleMax > 0 ? (xpEarned / xpPossibleMax) * 100 : 0

  return (
    <div className="space-y-3">
      {/* Habits bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Habits</span>
          <span>{habitsComplete}/{habitsTotal}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(habitPct, 100)}%` }}
          />
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>
            XP{keystoneBonus && <span className="text-amber-400 ml-1">1.5x</span>}
          </span>
          <span>{xpEarned}/{xpPossibleMax}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              keystoneBonus ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(xpPct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
