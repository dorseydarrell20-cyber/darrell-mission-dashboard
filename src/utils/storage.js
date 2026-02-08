const KEYS = {
  habits: 'dmb-habits',
  dayLogs: 'dmb-dayLogs',
  config: 'dmb-config',
}

export function loadHabits() {
  try {
    const raw = localStorage.getItem(KEYS.habits)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveHabits(habits) {
  localStorage.setItem(KEYS.habits, JSON.stringify(habits))
}

export function loadDayLogs() {
  try {
    const raw = localStorage.getItem(KEYS.dayLogs)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveDayLogs(logs) {
  localStorage.setItem(KEYS.dayLogs, JSON.stringify(logs))
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEYS.config)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveConfig(config) {
  localStorage.setItem(KEYS.config, JSON.stringify(config))
}

export function exportAllData() {
  return JSON.stringify({
    habits: loadHabits(),
    dayLogs: loadDayLogs(),
    config: loadConfig(),
    exportedAt: new Date().toISOString(),
  }, null, 2)
}

export function importAllData(jsonStr) {
  const data = JSON.parse(jsonStr)
  if (data.habits) saveHabits(data.habits)
  if (data.dayLogs) saveDayLogs(data.dayLogs)
  if (data.config) saveConfig(data.config)
  return data
}

export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
