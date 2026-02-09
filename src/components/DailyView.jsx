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

      {/* Progress + XP counter card */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <ProgressBars
          habitsComplete={xp.habitsComplete}
          habitsTotal={xp.habitsTotal}
          xpEarned={xp.xpEarned}
          xpPossibleMax={xp.xpPossibleMax}
          keystoneBonus={xp.keystoneBonus}
        />

        {/* XP counter */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="text-3xl font-bold text-white tracking-tight">{xp.xpEarned}</span>
          <span className="text-white/25 text-sm font-light">/ {xp.xpPossibleMax} XP</span>
          {xp.keystoneBonus && (
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-semibold ring-1 ring-amber-500/20">
              &#9733; 1.5x KEYSTONE
            </span>
          )}
        </div>
      </div>

      {/* Habit packs */}
      <div className="glass rounded-2xl p-4 space-y-3">
        {PACK_ORDER.filter(p => grouped[p]).map(packKey => {
          const pack = PACKS[packKey]
          const habits = grouped[packKey]
          const done = habits.filter(h => log.completed.includes(h.id)).length
          const allDone = done === habits.length
          const isCollapsed = collapsed[packKey]

          return (
            <div key={packKey}>
              <button
                onClick={() => toggleCollapse(packKey)}
                className="w-full flex items-center gap-2.5 px-1 py-2 text-left group"
              >
                <span className="text-base">{pack.emoji}</span>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  {pack.name}
                </span>
                <span className={`text-xs font-mono ${
                  allDone ? 'text-emerald-400' : 'text-white/25'
                }`}>
                  {done}/{habits.length}
                </span>
                {allDone && <span className="text-emerald-400 text-xs">&#10003;</span>}
                <svg
                  className={`w-3.5 h-3.5 text-white/20 ml-auto transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!isCollapsed && (
                <div className="space-y-1.5 pb-1">
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
    </div>
  )
}
