import { useState, useEffect } from 'react'
import { DEFAULT_HABITS } from '../data/defaultHabits'
import { loadHabits, saveHabits } from '../utils/storage'

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    return loadHabits() || [...DEFAULT_HABITS]
  })

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  function addHabit(habit) {
    setHabits(prev => [...prev, { ...habit, id: String(Date.now()), order: prev.length + 1 }])
  }

  function updateHabit(id, updates) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h))
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  function reorderHabit(id, direction) {
    setHabits(prev => {
      const idx = prev.findIndex(h => h.id === id)
      if (idx < 0) return prev
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next.map((h, i) => ({ ...h, order: i + 1 }))
    })
  }

  function resetHabits() {
    const fresh = [...DEFAULT_HABITS]
    setHabits(fresh)
  }

  return { habits, addHabit, updateHabit, deleteHabit, reorderHabit, resetHabits, setHabits }
}
