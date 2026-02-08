import { useState, useEffect, useCallback } from 'react'
import { toDateStr, getTemplate } from '../utils/dates'
import { calcXP, isMvdComplete } from '../utils/scoring'
import { getHabitsForTemplate } from '../utils/templates'
import { loadDayLogs, saveDayLogs } from '../utils/storage'

export function useDayLog(habits) {
  const [dayLogs, setDayLogs] = useState(() => loadDayLogs())
  const [today] = useState(() => toDateStr())

  const template = getTemplate(today)
  const todayHabits = getHabitsForTemplate(habits, template)
  const log = dayLogs[today] || {
    date: today,
    template,
    stateTag: null,
    completed: [],
    xpEarned: 0,
    xpPossible: 0,
    keystoneBonus: false,
    mvdComplete: false,
  }

  useEffect(() => {
    saveDayLogs(dayLogs)
  }, [dayLogs])

  const toggleHabit = useCallback((habitId) => {
    setDayLogs(prev => {
      const current = prev[today] || {
        date: today,
        template,
        stateTag: null,
        completed: [],
      }
      const completed = current.completed.includes(habitId)
        ? current.completed.filter(id => id !== habitId)
        : [...current.completed, habitId]

      const xp = calcXP(todayHabits, completed)
      const mvdComplete = isMvdComplete(todayHabits, completed)

      return {
        ...prev,
        [today]: {
          ...current,
          completed,
          xpEarned: xp.xpEarned,
          xpPossible: xp.xpPossible,
          keystoneBonus: xp.keystoneBonus,
          mvdComplete,
        },
      }
    })
  }, [today, template, todayHabits])

  const setStateTag = useCallback((tag) => {
    setDayLogs(prev => ({
      ...prev,
      [today]: { ...prev[today] || { date: today, template, stateTag: null, completed: [] }, stateTag: tag },
    }))
  }, [today, template])

  return {
    today,
    template,
    todayHabits,
    log,
    dayLogs,
    toggleHabit,
    setStateTag,
    setDayLogs,
  }
}
