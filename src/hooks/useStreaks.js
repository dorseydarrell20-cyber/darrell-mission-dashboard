import { useMemo } from 'react'
import { calcStreak, calcPackStreak } from '../utils/scoring'
import { PACK_ORDER } from '../data/packs'

export function useStreaks(dayLogs, habits, today) {
  const overall = useMemo(() => calcStreak(dayLogs, today), [dayLogs, today])

  const packStreaks = useMemo(() => {
    const result = {}
    for (const pack of PACK_ORDER) {
      result[pack] = calcPackStreak(dayLogs, habits, pack, today)
    }
    return result
  }, [dayLogs, habits, today])

  return { overall, packStreaks }
}
