export function getHabitsForTemplate(habits, template) {
  return habits.filter(h => {
    if (!h.active) return false
    if (h.schedule === 'both') return true
    if (h.schedule === template) return true
    // Sunday includes offday habits
    if (template === 'sunday' && h.schedule === 'offday') return true
    return false
  }).sort((a, b) => a.order - b.order)
}

export function groupByPack(habits) {
  const groups = {}
  for (const h of habits) {
    if (!groups[h.pack]) groups[h.pack] = []
    groups[h.pack].push(h)
  }
  return groups
}
