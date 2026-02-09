import { getMonthDates, formatMonthYear, getDayOfWeek } from '../utils/dates'
import { isDayComplete } from '../utils/scoring'

export default function MonthlyView({ dayLogs, today }) {
  const monthDates = getMonthDates(today)
  const firstDow = getDayOfWeek(monthDates[0])
  const offset = firstDow === 0 ? 6 : firstDow - 1

  const completeDays = monthDates.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length
  const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  function getCellStyle(dateStr) {
    const log = dayLogs[dateStr]
    if (!log) return { bg: 'bg-white/[0.02]', text: 'text-white/20' }
    const pct = log.xpPossible > 0 ? log.xpEarned / log.xpPossible : 0
    if (pct >= 0.9) return { bg: 'bg-emerald-500/30', text: 'text-emerald-300' }
    if (pct >= 0.7) return { bg: 'bg-emerald-500/15', text: 'text-emerald-400/70' }
    if (pct >= 0.4) return { bg: 'bg-amber-500/15', text: 'text-amber-400/60' }
    if (pct > 0) return { bg: 'bg-red-500/10', text: 'text-red-400/50' }
    return { bg: 'bg-white/[0.02]', text: 'text-white/20' }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{formatMonthYear(today)}</h3>
        <span className="text-sm font-mono text-white/60">{completeDays}/{monthDates.length}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map((d, i) => (
          <div key={i} className="text-[9px] text-white/25 text-center py-1 font-medium">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {monthDates.map(dateStr => {
          const isToday = dateStr === today
          const day = parseInt(dateStr.split('-')[2])
          const style = getCellStyle(dateStr)
          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium transition-all duration-200 ${style.bg} ${style.text} ${
                isToday ? 'ring-1 ring-blue-500/50' : ''
              } ${dateStr > today ? 'opacity-20' : ''}`}
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
