import { PACKS, PACK_ORDER } from '../data/packs'

export default function StreakDisplay({ overall, packStreaks }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3">Streaks</h3>

      {/* Overall */}
      <div className="flex items-center gap-2 mb-3 px-2 py-2 rounded-lg bg-gray-800/50 border border-gray-800">
        <span className="text-lg">{overall > 0 ? '\u{1F525}' : '\u{1F9CA}'}</span>
        <span className="text-sm text-gray-300">Overall</span>
        <span className="ml-auto text-lg font-bold text-white">{overall}</span>
        <span className="text-xs text-gray-500">days</span>
      </div>

      {/* Per-pack */}
      <div className="grid grid-cols-2 gap-2">
        {PACK_ORDER.map(packKey => {
          const pack = PACKS[packKey]
          const streak = packStreaks[packKey] || 0
          return (
            <div key={packKey} className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-900/50">
              <span className="text-xs">{pack.emoji}</span>
              <span className="text-xs text-gray-400 flex-1">{pack.name}</span>
              <span className={`text-sm font-mono ${streak > 0 ? 'text-white' : 'text-gray-600'}`}>
                {streak}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
