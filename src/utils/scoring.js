export function calcXP(todayHabits, completedIds) {
  let base = 0
  const keystones = todayHabits.filter(h => h.keystone)
  const allKeystonesDone = keystones.length > 0 && keystones.every(h => completedIds.includes(h.id))

  for (const h of todayHabits) {
    if (completedIds.includes(h.id)) {
      base += h.xp
    }
  }

  const multiplier = allKeystonesDone ? 1.5 : 1
  return {
    xpEarned: Math.round(base * multiplier),
    xpBase: base,
    xpPossible: Math.round(todayHabits.reduce((sum, h) => sum + h.xp, 0) * (allKeystonesDone ? 1.5 : 1)),
    xpPossibleMax: Math.round(todayHabits.reduce((sum, h) => sum + h.xp, 0) * 1.5),
    keystoneBonus: allKeystonesDone,
    habitsComplete: completedIds.filter(id => todayHabits.some(h => h.id === id)).length,
    habitsTotal: todayHabits.length,
  }
}

export function isDayComplete(dayLog) {
  if (!dayLog || dayLog.xpPossible === 0) return false
  return dayLog.xpEarned / dayLog.xpPossible >= 0.7
}

export function isMvdComplete(todayHabits, completedIds) {
  const mvdHabits = todayHabits.filter(h => h.mvd)
  return mvdHabits.length > 0 && mvdHabits.every(h => completedIds.includes(h.id))
}

export function calcStreak(dayLogs, today) {
  let streak = 0
  let buffersUsed = 0
  const sorted = Object.keys(dayLogs).sort().reverse()

  // Start from today and go backwards
  const todayDate = new Date(today + 'T00:00:00')
  const d = new Date(todayDate)

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().slice(0, 10)
    const log = dayLogs[dateStr]

    if (log) {
      if (isDayComplete(log)) {
        streak++
      } else if (log.mvdComplete) {
        // MVD preserves streak
        streak++
      } else {
        // Check buffer: max 1 skip per 7 days
        if (buffersUsed < Math.floor((streak + 1) / 7) + 1) {
          buffersUsed++
          streak++
        } else {
          break
        }
      }
    } else if (i === 0) {
      // Today has no log yet, don't break streak
      // just don't count it
    } else {
      // No log for a past day
      if (buffersUsed < Math.floor((streak + 1) / 7) + 1) {
        buffersUsed++
        streak++
      } else {
        break
      }
    }

    d.setDate(d.getDate() - 1)
  }

  return streak
}

export function calcPackStreak(dayLogs, habits, pack, today) {
  let streak = 0
  const d = new Date(today + 'T00:00:00')

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().slice(0, 10)
    const log = dayLogs[dateStr]

    if (i === 0 && !log) {
      d.setDate(d.getDate() - 1)
      continue
    }

    if (!log) break

    const packHabits = habits.filter(h =>
      h.pack === pack && h.active && isHabitScheduled(h, log.template)
    )

    if (packHabits.length === 0) {
      // No habits for this pack on this day template, skip
      d.setDate(d.getDate() - 1)
      continue
    }

    const allDone = packHabits.every(h => log.completed.includes(h.id))
    if (allDone) {
      streak++
    } else {
      break
    }

    d.setDate(d.getDate() - 1)
  }

  return streak
}

function isHabitScheduled(habit, template) {
  if (habit.schedule === 'both') return true
  if (habit.schedule === template) return true
  if (template === 'sunday' && habit.schedule === 'offday') return true
  return false
}
