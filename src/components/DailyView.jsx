import { useState } from 'react'
import HabitItem from './HabitItem'
import ProgressBars from './ProgressBars'
import MvdIndicator from './MvdIndicator'
import CelebrationBanner from './CelebrationBanner'
import { groupByPack } from '../utils/templates'
import { calcXP } from '../utils/scoring'
import { PACKS, PACK_ORDER } from '../data/packs'

export default function DailyView({ todayHabits, log, onToggle, streak }) {
  const [collapsed, setCollapsed] = useState({})
  const grouped = groupByPack(todayHabits)
  const xp = calcXP(todayHabits, log.completed)

  const toggleCollapse = (pack) => {
    setCollapsed(prev => ({ ...prev, [pack]: !prev[pack] }))
  }

  return (
    <div className="space-y-4">
      {/* Celebration */}
      <CelebrationBanner log={log} streak={streak} />

      {/* MVD */}
      <MvdIndicator todayHabits={todayHabits} completedIds={log.completed} />

      {/* Progress */}
      <ProgressBars
        habitsComplete={xp.habitsComplete}
        habitsTotal={xp.habitsTotal}
        xpEarned={xp.xpEarned}
        xpPossibleMax={xp.xpPossibleMax}
        keystoneBonus={xp.keystoneBonus}
      />

      {/* XP counter */}
      <div className="flex items-center justify-center gap-3 py-1">
        <span className="text-2xl font-bold text-white">{xp.xpEarned}</span>
        <span className="text-gray-500 text-sm">/ {xp.xpPossibleMax} XP</span>
        {xp.keystoneBonus && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-900/50 text-amber-400 font-medium">
            &#9733; 1.5x Keystone Bonus
          </span>
        )}
      </div>

      {/* Habit packs */}
      {PACK_ORDER.filter(p => grouped[p]).map(packKey => {
        const pack = PACKS[packKey]
        const habits = grouped[packKey]
        const done = habits.filter(h => log.completed.includes(h.id)).length
        const isCollapsed = collapsed[packKey]

        return (
          <div key={packKey}>
            <button
              onClick={() => toggleCollapse(packKey)}
              className="w-full flex items-center gap-2 px-1 py-1.5 text-left group"
            >
              <span>{pack.emoji}</span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {pack.name}
              </span>
              <span className="text-xs text-gray-500">{done}/{habits.length}</span>
              <svg
                className={`w-3 h-3 text-gray-500 ml-auto transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {!isCollapsed && (
              <div className="space-y-1.5 ml-1">
                {habits.map(habit => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    completed={log.completed.includes(habit.id)}
                    onToggle={() => onToggle(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
