export function toDateStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getDayOfWeek(dateStr) {
  return parseDate(dateStr).getDay() // 0=Sun, 6=Sat
}

export function getTemplate(dateStr) {
  const dow = getDayOfWeek(dateStr)
  if (dow === 0) return 'sunday'
  if (dow === 6) return 'offday'
  return 'workday'
}

export function getWeekDates(dateStr) {
  const date = parseDate(dateStr)
  const dow = date.getDay()
  // Find Monday of the current week
  const monday = new Date(date)
  const diff = dow === 0 ? -6 : 1 - dow
  monday.setDate(monday.getDate() + diff)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(toDateStr(d))
  }
  return dates
}

export function getMonthDates(dateStr) {
  const date = parseDate(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const dates = []
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    dates.push(toDateStr(new Date(d)))
  }
  return dates
}

export function formatDateShort(dateStr) {
  const date = parseDate(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatMonthYear(dateStr) {
  const date = parseDate(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export function dayName(dateStr) {
  return DAY_NAMES[getDayOfWeek(dateStr)]
}
