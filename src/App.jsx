import { useState } from 'react'
import DailyView from './components/DailyView'
import WeeklyView from './components/WeeklyView'
import MonthlyView from './components/MonthlyView'
import StreakDisplay from './components/StreakDisplay'
import StateTagPicker from './components/StateTagPicker'
import Settings from './components/Settings'
import { useHabits } from './hooks/useHabits'
import { useDayLog } from './hooks/useDayLog'
import { useStreaks } from './hooks/useStreaks'
import { formatDateShort } from './utils/dates'

const TEMPLATE_LABELS = {
  workday: 'Workday',
  offday: 'Offday',
  sunday: 'Sunday',
}

const TEMPLATE_COLORS = {
  workday: 'bg-blue-900/50 text-blue-300',
  offday: 'bg-purple-900/50 text-purple-300',
  sunday: 'bg-amber-900/50 text-amber-300',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const { habits, addHabit, updateHabit, deleteHabit, reorderHabit, resetHabits } = useHabits()
  const { today, template, todayHabits, log, dayLogs, toggleHabit, setStateTag } = useDayLog(habits)
  const { overall, packStreaks } = useStreaks(dayLogs, habits, today)

  if (page === 'settings') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <Settings
          habits={habits}
          onUpdate={updateHabit}
          onAdd={addHabit}
          onDelete={deleteHabit}
          onReorder={reorderHabit}
          onReset={resetHabits}
          onNavigateBack={() => setPage('dashboard')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Mission Dashboard</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-gray-400">{formatDateShort(today)}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TEMPLATE_COLORS[template]}`}>
              {TEMPLATE_LABELS[template]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StateTagPicker value={log.stateTag} onChange={setStateTag} />
          <button
            onClick={() => setPage('settings')}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Daily Habits */}
      <DailyView
        todayHabits={todayHabits}
        log={log}
        onToggle={toggleHabit}
        streak={overall}
      />

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Weekly + Streaks row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <WeeklyView dayLogs={dayLogs} today={today} />
        <StreakDisplay overall={overall} packStreaks={packStreaks} />
      </div>

      {/* Monthly */}
      <MonthlyView dayLogs={dayLogs} today={today} />

      {/* Footer */}
      <footer className="text-center text-xs text-gray-700 pt-4">
        Mission Dashboard v1.0
      </footer>
    </div>
  )
}
