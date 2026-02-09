import { PACKS } from '../data/packs'

const PACK_ACCENT = {
  builder: { ring: 'ring-pack-builder/30', bg: 'bg-pack-builder', glow: 'glow-blue' },
  revenue: { ring: 'ring-pack-revenue/30', bg: 'bg-pack-revenue', glow: 'glow-emerald' },
  creator: { ring: 'ring-pack-creator/30', bg: 'bg-pack-creator', glow: 'glow-amber' },
  artist: { ring: 'ring-pack-artist/30', bg: 'bg-pack-artist', glow: 'glow-purple' },
  body: { ring: 'ring-pack-body/30', bg: 'bg-pack-body', glow: '' },
  systems: { ring: 'ring-pack-systems/30', bg: 'bg-pack-systems', glow: '' },
}

export default function HabitItem({ habit, completed, onToggle }) {
  const accent = PACK_ACCENT[habit.pack]

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left group ${
        completed
          ? `glass-light ring-1 ${accent.ring}`
          : 'glass-light glass-hover ring-1 ring-transparent'
      }`}
    >
      {/* Checkbox */}
      <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
        completed
          ? `${accent.bg} shadow-lg`
          : 'ring-1 ring-white/15 group-hover:ring-white/30'
      }`}>
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Name */}
      <span className={`flex-1 text-sm transition-colors duration-200 ${
        completed ? 'text-white/40 line-through decoration-white/20' : 'text-white/80 group-hover:text-white'
      }`}>
        {habit.name}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {habit.mvd && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400/90 font-semibold tracking-wide ring-1 ring-amber-500/20">
            MVD
          </span>
        )}
        {habit.keystone && (
          <span className="text-amber-400 text-xs drop-shadow-sm" title="Keystone habit">&#9733;</span>
        )}
        <span className="text-[10px] text-white/25 font-mono">{habit.xp}xp</span>
      </div>
    </button>
  )
}
