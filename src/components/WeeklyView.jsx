import { getWeekDates, dayName } from '../utils/dates'
import { isDayComplete } from '../utils/scoring'

export default function WeeklyView({ dayLogs, today }) {
  const weekDates = getWeekDates(today)
  const workdays = weekDates.slice(0, 5)
  const completeDays = workdays.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">This Week</h3>
        <span className="text-sm font-mono text-white/60">{completeDays}/5</span>
      </div>
      <div className="flex gap-1.5">
        {weekDates.map(dateStr => {
          const log = dayLogs[dateStr]
          const complete = log && isDayComplete(log)
          const isToday = dateStr === today
          const hasPassed = dateStr < today
          const hasLog = !!log

          return (
            <div key={dateStr} className="flex-1 text-center">
              <div className="text-[9px] text-white/30 mb-1.5 font-medium">{dayName(dateStr)}</div>
              <div className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center text-xs transition-all duration-200 ${
                isToday
                  ? 'ring-1 ring-blue-500/50 bg-blue-500/10 glow-blue'
                  : complete
                    ? 'bg-emerald-500/15 ring-1 ring-emerald-500/30'
                    : hasPassed && hasLog
                      ? 'bg-red-500/10 ring-1 ring-red-500/20'
                      : 'bg-white/[0.03] ring-1 ring-white/5'
              }`}>
                {complete ? (
                  <span className="text-emerald-400 font-medium">&#10003;</span>
                ) : hasPassed && hasLog ? (
                  <span className="text-red-400/70">&#10005;</span>
                ) : isToday ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
