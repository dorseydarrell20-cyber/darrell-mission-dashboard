import { PACKS, PACK_ORDER } from '../data/packs'

export default function StreakDisplay({ overall, packStreaks }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Streaks</h3>

      {/* Overall */}
      <div className={`flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl glass-light ring-1 ${
        overall > 0 ? 'ring-orange-500/20' : 'ring-white/5'
      }`}>
        <span className={`text-xl ${overall > 0 ? 'pulse-slow' : ''}`}>
          {overall > 0 ? '\u{1F525}' : '\u{1F9CA}'}
        </span>
        <span className="text-sm text-white/50 font-light">Overall</span>
        <span className="ml-auto text-xl font-bold text-white tracking-tight">{overall}</span>
        <span className="text-[10px] text-white/25 font-light">days</span>
      </div>

      {/* Per-pack */}
      <div className="grid grid-cols-2 gap-1.5">
        {PACK_ORDER.map(packKey => {
          const pack = PACKS[packKey]
          const streak = packStreaks[packKey] || 0
          return (
            <div key={packKey} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg glass-light ring-1 ring-white/[0.03]">
              <span className="text-xs">{pack.emoji}</span>
              <span className="text-[11px] text-white/35 flex-1">{pack.name}</span>
              <span className={`text-sm font-mono ${streak > 0 ? 'text-white/80' : 'text-white/15'}`}>
                {streak}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
