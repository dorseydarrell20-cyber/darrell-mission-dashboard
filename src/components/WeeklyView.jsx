import { getWeekDates, dayName } from '../utils/dates'
import { isDayComplete } from '../utils/scoring'

export default function WeeklyView({ dayLogs, today }) {
  const weekDates = getWeekDates(today)
  const workdays = weekDates.slice(0, 5) // Mon-Fri
  const completeDays = workdays.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">This Week</h3>
        <span className="text-sm font-mono text-gray-300">{completeDays}/5 days</span>
      </div>
      <div className="flex gap-2">
        {weekDates.map(dateStr => {
          const log = dayLogs[dateStr]
          const complete = log && isDayComplete(log)
          const isToday = dateStr === today
          const hasPassed = dateStr < today
          const hasLog = !!log

          return (
            <div key={dateStr} className="flex-1 text-center">
              <div className="text-[10px] text-gray-500 mb-1">{dayName(dateStr)}</div>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs border ${
                isToday
                  ? 'border-blue-500 bg-blue-950/50'
                  : complete
                    ? 'border-emerald-600 bg-emerald-950/50'
                    : hasPassed && hasLog
                      ? 'border-red-800 bg-red-950/30'
                      : 'border-gray-800 bg-gray-900/30'
              }`}>
                {complete ? (
                  <span className="text-emerald-400">&#10003;</span>
                ) : hasPassed && hasLog ? (
                  <span className="text-red-400">&#10005;</span>
                ) : isToday ? (
                  <span className="text-blue-400">&#8226;</span>
                ) : (
                  <span className="text-gray-600">&#8226;</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
