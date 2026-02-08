let id = 0
const h = (name, pack, schedule, keystone = false, mvd = false) => ({
  id: String(++id),
  name,
  pack,
  xp: 10,
  schedule,
  keystone,
  mvd,
  active: true,
  order: id,
})

export const DEFAULT_HABITS = [
  // Builder
  h('60-120 min focused build session', 'builder', 'workday', true, true),
  h('Fix or understand 1 bug/error', 'builder', 'workday'),
  h('Write 3 bullets of what I built/learned', 'builder', 'both'),

  // Revenue
  h('Work on 1 automation asset', 'revenue', 'workday', true),
  h('Review or update revenue pipeline', 'revenue', 'workday'),
  h('Save 1 monetizable idea or use case', 'revenue', 'both'),

  // Creator
  h('Review or approve Hermes content', 'creator', 'both'),
  h('Write or refine 1 hook/angle', 'creator', 'workday'),
  h('Log 1 insight from AI/news signal', 'creator', 'both'),

  // Artist
  h('20-30 min writing, freestyling, or listening', 'artist', 'both', true, true),
  h('Practice schemes or lyrical exercise', 'artist', 'offday'),
  h('Organize or review lyrics/notes', 'artist', 'both'),
  h('Music class/lesson (Sunday only)', 'artist', 'sunday'),

  // Body
  h('Workout, yoga, or long walk (30-60 min)', 'body', 'both', true, true),
  h('Eat at least one clean meal', 'body', 'both'),
  h('Stretch or mobility work (5-10 min)', 'body', 'both'),

  // Systems
  h('Morning Brief review + top 3 outcomes', 'systems', 'workday'),
  h('Evening wrap-up (log wins, misses, tomorrow)', 'systems', 'both', true),
  h('Quick Amazon FBA / finance check-in', 'systems', 'offday'),
]
