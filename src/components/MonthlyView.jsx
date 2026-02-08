import { getMonthDates, formatMonthYear, getDayOfWeek } from '../utils/dates'
import { isDayComplete } from '../utils/scoring'

export default function MonthlyView({ dayLogs, today }) {
  const monthDates = getMonthDates(today)
  const firstDow = getDayOfWeek(monthDates[0])
  // Adjust so Monday=0
  const offset = firstDow === 0 ? 6 : firstDow - 1

  const completeDays = monthDates.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length
  const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  function getColor(dateStr) {
    const log = dayLogs[dateStr]
    if (!log) return 'bg-gray-900'
    const pct = log.xpPossible > 0 ? log.xpEarned / log.xpPossible : 0
    if (pct >= 0.9) return 'bg-emerald-600'
    if (pct >= 0.7) return 'bg-emerald-800'
    if (pct >= 0.4) return 'bg-yellow-900'
    if (pct > 0) return 'bg-red-900/60'
    return 'bg-gray-900'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">{formatMonthYear(today)}</h3>
        <span className="text-sm font-mono text-gray-300">{completeDays}/{monthDates.length} days</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((d, i) => (
          <div key={i} className="text-[10px] text-gray-600 text-center py-0.5">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {monthDates.map(dateStr => {
          const isToday = dateStr === today
          const day = parseInt(dateStr.split('-')[2])
          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-sm flex items-center justify-center text-[10px] ${getColor(dateStr)} ${
                isToday ? 'ring-1 ring-blue-500' : ''
              } ${dateStr > today ? 'opacity-30' : ''}`}
              title={dateStr}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
