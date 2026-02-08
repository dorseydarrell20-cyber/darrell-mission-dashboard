import { PACKS } from '../data/packs'

export default function HabitItem({ habit, completed, onToggle }) {
  const pack = PACKS[habit.pack]
  const colorMap = {
    'pack-builder': 'border-pack-builder',
    'pack-revenue': 'border-pack-revenue',
    'pack-creator': 'border-pack-creator',
    'pack-artist': 'border-pack-artist',
    'pack-body': 'border-pack-body',
    'pack-systems': 'border-pack-systems',
  }
  const bgMap = {
    'pack-builder': 'bg-pack-builder',
    'pack-revenue': 'bg-pack-revenue',
    'pack-creator': 'bg-pack-creator',
    'pack-artist': 'bg-pack-artist',
    'pack-body': 'bg-pack-body',
    'pack-systems': 'bg-pack-systems',
  }

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-150 text-left ${
        completed
          ? `${colorMap[pack.color]} bg-gray-800/50 border-opacity-60`
          : 'border-gray-800 hover:border-gray-700 bg-gray-900/50'
      }`}
    >
      {/* Checkbox */}
      <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
        completed
          ? `${bgMap[pack.color]} border-transparent`
          : 'border-gray-600'
      }`}>
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Name */}
      <span className={`flex-1 text-sm ${completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
        {habit.name}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {habit.mvd && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-400 font-medium">MVD</span>
        )}
        {habit.keystone && (
          <span className="text-amber-400 text-xs" title="Keystone habit">&#9733;</span>
        )}
        <span className="text-[10px] text-gray-500 font-mono">{habit.xp}xp</span>
      </div>
    </button>
  )
}
