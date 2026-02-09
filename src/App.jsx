import { useState, useMemo, useRef, useEffect } from 'react'
import { useHabits } from './hooks/useHabits'
import { useDayLog } from './hooks/useDayLog'
import { useStreaks } from './hooks/useStreaks'
import { calcXP, isDayComplete, isMvdComplete } from './utils/scoring'
import { groupByPack } from './utils/templates'
import { formatDateShort, getWeekDates, getMonthDates, formatMonthYear, getDayOfWeek, dayName } from './utils/dates'
import { PACKS, PACK_ORDER } from './data/packs'
import { STATE_TAGS } from './data/stateTags'
import { CELEBRATIONS } from './data/celebrations'
import { exportAllData, importAllData, clearAllData } from './utils/storage'

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function getLevel(totalXP) {
  let level = 1, xpNeeded = 150, xpAccum = 0
  while (xpAccum + xpNeeded <= totalXP && level < 99) {
    xpAccum += xpNeeded
    level++
    xpNeeded = Math.floor(xpNeeded * 1.08)
  }
  return { level, xpInLevel: totalXP - xpAccum, xpForNext: xpNeeded }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const TEMPLATE_LABELS = { workday: 'Workday', offday: 'Offday', sunday: 'Sunday' }

// ═══════════════════════════════════════════
//  ORNATE PANEL
// ═══════════════════════════════════════════

function Panel({ title, icon, children, className = '', bodyClass = '' }) {
  return (
    <div className={`rs-panel ${className}`}>
      {title && (
        <div className="rs-panel-title">
          {icon && <span className="text-base">{icon}</span>}
          <span className="rs-gold text-sm font-bold tracking-wide uppercase">{title}</span>
        </div>
      )}
      <div className={`rs-panel-body ${bodyClass}`}>{children}</div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  SEGMENTED XP BAR
// ═══════════════════════════════════════════

function XPBar({ current, max, gold = false, label }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  return (
    <div>
      {label && <div className="text-[10px] text-rs-text-dim mb-1 uppercase tracking-widest">{label}</div>}
      <div className="rs-xp-track">
        <div
          className={`rs-xp-fill ${gold ? 'rs-xp-fill-gold' : ''}`}
          style={{ width: `${pct}%` }}
        />
        <div className="rs-xp-text">{current} / {max} XP</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  QUEST CHECKBOX ITEM
// ═══════════════════════════════════════════

function QuestItem({ habit, completed, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`rs-quest ${completed ? 'rs-quest-done' : ''}`}
    >
      <div className="rs-quest-check">
        {completed && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <span className={`flex-1 text-[13px] ${
        completed
          ? 'text-rs-gold line-through decoration-rs-border'
          : 'text-rs-parchment-dark'
      }`}>
        {habit.name}
      </span>

      <div className="flex items-center gap-2 flex-shrink-0">
        {habit.mvd && (
          <span className="text-[9px] px-1.5 py-0.5 bg-rs-red/30 text-red-400 font-bold border border-rs-red/40 rounded-sm">
            MVD
          </span>
        )}
        {habit.keystone && <span className="rs-gold-bright text-sm">&#9733;</span>}
        <span className="font-['Press_Start_2P'] text-[8px] text-rs-text-dim">{habit.xp}xp</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  CHARACTER PANEL (Left)
// ═══════════════════════════════════════════

function CharacterPanel({ xp, levelInfo, totalXP, streak, mvdComplete, mvdHabits, completedIds, stateTag, onStateTag }) {
  const currentTag = STATE_TAGS.find(t => t.label === stateTag)
  const [tagOpen, setTagOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Level Badge */}
      <div className="text-center py-3">
        <div className="inline-block border-2 border-rs-border rounded bg-gradient-to-b from-rs-panel-light to-rs-panel p-4 shadow-lg">
          <div className="text-[9px] text-rs-text-dim uppercase tracking-widest mb-1">Combat Level</div>
          <div className="font-['Press_Start_2P'] text-3xl rs-gold-bright">{levelInfo.level}</div>
        </div>
        <div className="mt-2 text-[10px] text-rs-text-dim">
          Total: <span className="rs-gold font-['Press_Start_2P'] text-[9px]">{totalXP.toLocaleString()}</span> XP
        </div>
      </div>

      {/* Level Progress */}
      <XPBar
        current={levelInfo.xpInLevel}
        max={levelInfo.xpForNext}
        gold
        label="Next Level"
      />

      <div className="rs-divider" />

      {/* Today's XP */}
      <XPBar
        current={xp.xpEarned}
        max={xp.xpPossibleMax}
        gold={xp.keystoneBonus}
        label={`Today's XP${xp.keystoneBonus ? ' (1.5x Bonus!)' : ''}`}
      />

      {/* Habits Progress */}
      <div className="flex justify-between text-xs">
        <span className="text-rs-text-dim">Quests</span>
        <span className="rs-gold">{xp.habitsComplete}/{xp.habitsTotal}</span>
      </div>

      <div className="rs-divider" />

      {/* MVD Status */}
      <div>
        <div className="text-[10px] text-rs-text-dim uppercase tracking-widest mb-2">Minimum Viable Day</div>
        <div className={`border-2 rounded p-2 text-center ${
          mvdComplete
            ? 'border-rs-gold bg-rs-gold/10'
            : 'border-rs-border bg-rs-bg/50'
        }`}>
          {mvdComplete ? (
            <span className="rs-gold-bright text-sm font-bold">MVD Complete</span>
          ) : (
            <span className="text-rs-text-dim text-xs">
              {mvdHabits.filter(h => completedIds.includes(h.id)).length}/{mvdHabits.length} essentials
            </span>
          )}
        </div>
        <div className="mt-1.5 space-y-1">
          {mvdHabits.map(h => (
            <div key={h.id} className={`text-[10px] px-2 py-1 rounded-sm border ${
              completedIds.includes(h.id)
                ? 'border-rs-gold/30 text-rs-gold bg-rs-gold/5'
                : 'border-rs-border/30 text-rs-text-dim'
            }`}>
              {h.name.length > 35 ? h.name.slice(0, 35) + '...' : h.name}
            </div>
          ))}
        </div>
      </div>

      <div className="rs-divider" />

      {/* Overall Streak */}
      <div className="text-center">
        <div className="text-[10px] text-rs-text-dim uppercase tracking-widest mb-1">Streak</div>
        <div className="flex items-center justify-center gap-2">
          <span className={`text-2xl ${streak > 0 ? 'rs-fire' : ''}`}>
            {streak > 0 ? '\u{1F525}' : '\u{1F9CA}'}
          </span>
          <span className="font-['Press_Start_2P'] text-xl rs-gold">{streak}</span>
          <span className="text-[10px] text-rs-text-dim">days</span>
        </div>
      </div>

      <div className="rs-divider" />

      {/* State Tag */}
      <div className="relative">
        <div className="text-[10px] text-rs-text-dim uppercase tracking-widest mb-1.5">State</div>
        <button onClick={() => setTagOpen(!tagOpen)} className="rs-btn w-full text-left flex items-center gap-2">
          <span>{currentTag ? currentTag.emoji : '\u{1F3AF}'}</span>
          <span className="text-xs">{currentTag ? currentTag.label : 'Select State'}</span>
          <span className="ml-auto text-rs-text-dim text-[10px]">&#9660;</span>
        </button>
        {tagOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setTagOpen(false)} />
            <div className="absolute bottom-full mb-1 left-0 right-0 z-20 rs-panel">
              <div className="rs-panel-body p-1">
                {stateTag && (
                  <button onClick={() => { onStateTag(null); setTagOpen(false) }}
                    className="w-full text-left px-2 py-1.5 text-[11px] text-rs-text-dim hover:bg-rs-gold/5 rounded-sm">
                    Clear
                  </button>
                )}
                {STATE_TAGS.map(tag => (
                  <button key={tag.label}
                    onClick={() => { onStateTag(tag.label); setTagOpen(false) }}
                    className={`w-full text-left px-2 py-1.5 text-[11px] hover:bg-rs-gold/5 rounded-sm flex items-center gap-2 ${
                      stateTag === tag.label ? 'rs-gold' : 'text-rs-parchment-dark'
                    }`}>
                    <span>{tag.emoji}</span><span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  QUEST LOG (Center)
// ═══════════════════════════════════════════

function QuestLog({ todayHabits, log, onToggle }) {
  const [collapsed, setCollapsed] = useState({})
  const grouped = groupByPack(todayHabits)

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
      {PACK_ORDER.filter(p => grouped[p]).map(packKey => {
        const pack = PACKS[packKey]
        const habits = grouped[packKey]
        const done = habits.filter(h => log.completed.includes(h.id)).length
        const allDone = done === habits.length
        const isCollapsed = collapsed[packKey]

        return (
          <div key={packKey}>
            <div
              onClick={() => setCollapsed(prev => ({ ...prev, [packKey]: !prev[packKey] }))}
              className={`rs-category ${allDone ? 'rs-category-complete' : ''}`}
            >
              <span className="text-base">{pack.emoji}</span>
              <span className={`text-sm font-semibold flex-1 ${allDone ? 'rs-gold' : 'text-rs-parchment-dark'}`}>
                {pack.name}
              </span>
              <span className={`font-['Press_Start_2P'] text-[9px] ${allDone ? 'rs-gold' : 'text-rs-text-dim'}`}>
                {done}/{habits.length}
              </span>
              {allDone && <span className="rs-gold-bright">&#10003;</span>}
              <span className={`text-rs-text-dim text-xs transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}>
                &#9660;
              </span>
            </div>
            {!isCollapsed && habits.map(habit => (
              <QuestItem
                key={habit.id}
                habit={habit}
                completed={log.completed.includes(habit.id)}
                onToggle={() => onToggle(habit.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════
//  STREAK PANEL
// ═══════════════════════════════════════════

function StreakPanel({ overall, packStreaks }) {
  return (
    <div>
      {/* Overall */}
      <div className="flex items-center gap-2 p-2 border border-rs-border/30 rounded bg-rs-bg/30 mb-2">
        <span className={`text-lg ${overall > 0 ? 'rs-fire' : ''}`}>
          {overall > 0 ? '\u{1F525}' : '\u{1F9CA}'}
        </span>
        <span className="text-xs text-rs-parchment-dark flex-1">Overall</span>
        <span className="font-['Press_Start_2P'] text-sm rs-gold">{overall}</span>
      </div>
      {/* Per-pack */}
      <div className="space-y-1">
        {PACK_ORDER.map(pk => {
          const s = packStreaks[pk] || 0
          return (
            <div key={pk} className="flex items-center gap-2 px-2 py-1 text-[11px]">
              <span>{PACKS[pk].emoji}</span>
              <span className="text-rs-text-dim flex-1">{PACKS[pk].name}</span>
              <span className={`font-['Press_Start_2P'] text-[9px] ${s > 0 ? 'rs-gold' : 'text-rs-text-dim'}`}>{s}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  WEEKLY TRACKER
// ═══════════════════════════════════════════

function WeeklyTracker({ dayLogs, today }) {
  const weekDates = getWeekDates(today)
  const workdays = weekDates.slice(0, 5)
  const completeDays = workdays.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[10px] text-rs-text-dim uppercase tracking-widest">This Week</span>
        <span className="font-['Press_Start_2P'] text-[9px] rs-gold">{completeDays}/5</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map(dateStr => {
          const log = dayLogs[dateStr]
          const complete = log && isDayComplete(log)
          const isToday = dateStr === today
          const hasPassed = dateStr < today

          return (
            <div key={dateStr} className="text-center">
              <div className="text-[8px] text-rs-text-dim mb-1">{dayName(dateStr)}</div>
              <div className={`w-8 h-8 mx-auto rounded-sm flex items-center justify-center border transition-all ${
                complete
                  ? 'border-rs-gold bg-rs-gold/20 shadow-[0_0_8px_rgba(200,169,78,0.3)]'
                  : isToday
                    ? 'border-rs-gold bg-rs-bg'
                    : hasPassed && log
                      ? 'border-rs-red bg-rs-red/10'
                      : 'border-rs-border/30 bg-rs-bg/50'
              }`}>
                {complete ? (
                  <span className="rs-gold text-xs font-bold">&#10003;</span>
                ) : isToday ? (
                  <span className="w-2 h-2 rounded-full bg-rs-gold" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-rs-border/30" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  MONTHLY CALENDAR
// ═══════════════════════════════════════════

function MonthlyCalendar({ dayLogs, today }) {
  const monthDates = getMonthDates(today)
  const firstDow = getDayOfWeek(monthDates[0])
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const completeDays = monthDates.filter(d => dayLogs[d] && isDayComplete(dayLogs[d])).length

  function getCellClass(dateStr) {
    const log = dayLogs[dateStr]
    if (!log) return 'bg-rs-bg/30 text-rs-text-dim/40'
    const pct = log.xpPossible > 0 ? log.xpEarned / log.xpPossible : 0
    if (pct >= 0.7) return 'rs-cal-complete'
    if (pct > 0) return 'rs-cal-partial'
    return 'bg-rs-bg/30 text-rs-text-dim/40'
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[10px] text-rs-text-dim uppercase tracking-widest">{formatMonthYear(today)}</span>
        <span className="font-['Press_Start_2P'] text-[9px] rs-gold">{completeDays}/{monthDates.length}</span>
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-[8px] text-rs-text-dim text-center py-0.5 font-bold">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {monthDates.map(dateStr => {
          const isToday = dateStr === today
          const day = parseInt(dateStr.split('-')[2])
          return (
            <div
              key={dateStr}
              className={`rs-cal-day ${getCellClass(dateStr)} ${isToday ? 'rs-cal-today' : ''} ${dateStr > today ? 'opacity-25' : ''}`}
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

// ═══════════════════════════════════════════
//  QUEST COMPLETE BANNER
// ═══════════════════════════════════════════

function QuestCompleteBanner({ show, message, onDismiss }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onDismiss}>
      <div className="rs-quest-complete-banner rs-panel p-0" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 text-center">
          <div className="rs-quest-complete-text font-['MedievalSharp'] text-3xl text-rs-gold-bright mb-2">
            QUEST COMPLETE
          </div>
          <div className="rs-divider" />
          <p className="text-sm text-rs-parchment mt-3">{message}</p>
          <button onClick={onDismiss} className="rs-btn mt-4">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  SETTINGS VIEW
// ═══════════════════════════════════════════

function SettingsView({ habits, onUpdate, onAdd, onDelete, onReorder, onReset, onBack }) {
  const [editingId, setEditingId] = useState(null)
  const [showReset, setShowReset] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef()
  const SCHEDULES = ['workday', 'offday', 'both', 'sunday']

  return (
    <div className="rs-page-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Panel title="Settings" icon={'\u{2699}\u{FE0F}'}>
          <button onClick={onBack} className="rs-btn mb-3">&#8592; Back to Dashboard</button>

          {/* Habits */}
          <div className="flex items-center justify-between mb-3">
            <span className="rs-gold text-sm font-bold">Habit Editor</span>
            <button onClick={() => onAdd({ name: 'New habit', pack: 'builder', xp: 10, schedule: 'both', keystone: false, mvd: false, active: true })} className="rs-btn text-[10px]">+ Add Habit</button>
          </div>

          {PACK_ORDER.map(packKey => {
            const packHabits = habits.filter(h => h.pack === packKey)
            if (!packHabits.length) return null
            return (
              <div key={packKey} className="mb-3">
                <div className="text-[10px] text-rs-text-dim uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span>{PACKS[packKey].emoji}</span> {PACKS[packKey].name}
                </div>
                {packHabits.map(habit => (
                  <div key={habit.id} className="mb-1">
                    {editingId === habit.id ? (
                      <HabitEditor habit={habit}
                        onSave={u => { onUpdate(habit.id, u); setEditingId(null) }}
                        onCancel={() => setEditingId(null)}
                        onDelete={() => { onDelete(habit.id); setEditingId(null) }}
                      />
                    ) : (
                      <div className="rs-quest group" onClick={() => setEditingId(habit.id)}>
                        <div className="flex gap-0.5">
                          <button onClick={e => { e.stopPropagation(); onReorder(habit.id, 'up') }} className="text-rs-text-dim hover:text-rs-gold text-xs">&uarr;</button>
                          <button onClick={e => { e.stopPropagation(); onReorder(habit.id, 'down') }} className="text-rs-text-dim hover:text-rs-gold text-xs">&darr;</button>
                        </div>
                        <span className={`flex-1 text-[12px] ${habit.active ? 'text-rs-parchment-dark' : 'text-rs-text-dim/40'}`}>{habit.name}</span>
                        {habit.keystone && <span className="rs-gold-bright text-xs">&#9733;</span>}
                        {habit.mvd && <span className="text-[8px] text-red-400">MVD</span>}
                        <span className="text-[9px] text-rs-text-dim">{habit.schedule}</span>
                        <span className="text-[9px] text-rs-text-dim opacity-0 group-hover:opacity-100">Edit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}

          <div className="rs-divider my-4" />

          {/* Data */}
          <span className="rs-gold text-sm font-bold block mb-2">Data</span>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => {
              const data = exportAllData()
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = `mission-backup-${new Date().toISOString().slice(0,10)}.json`; a.click()
              URL.revokeObjectURL(url)
            }} className="rs-btn text-[10px]">Export JSON</button>
            <button onClick={() => fileRef.current?.click()} className="rs-btn text-[10px]">Import JSON</button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={e => {
              const file = e.target.files?.[0]; if (!file) return
              const reader = new FileReader()
              reader.onload = ev => { try { importAllData(ev.target.result); setImportMsg('Imported! Reloading...'); setTimeout(() => location.reload(), 800) } catch { setImportMsg('Invalid file.') } }
              reader.readAsText(file)
            }} />
          </div>
          {importMsg && <p className="text-xs text-rs-gold mt-1">{importMsg}</p>}

          <div className="rs-divider my-4" />

          {showReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Destroy all data?</span>
              <button onClick={() => { clearAllData(); onReset(); location.reload() }} className="rs-btn rs-btn-danger text-[10px]">Confirm</button>
              <button onClick={() => setShowReset(false)} className="rs-btn text-[10px]">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowReset(true)} className="rs-btn rs-btn-danger text-[10px]">Reset All Data</button>
          )}
        </Panel>
      </div>
    </div>
  )
}

function HabitEditor({ habit, onSave, onCancel, onDelete }) {
  const [f, setF] = useState({ ...habit })
  const SCHEDULES = ['workday', 'offday', 'both', 'sunday']
  return (
    <div className="p-3 border-2 border-rs-border rounded bg-rs-panel space-y-2">
      <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className="rs-input w-full text-sm" />
      <div className="flex gap-2 flex-wrap">
        <select value={f.pack} onChange={e => setF({ ...f, pack: e.target.value })} className="rs-select">
          {PACK_ORDER.map(p => <option key={p} value={p}>{PACKS[p].name}</option>)}
        </select>
        <select value={f.schedule} onChange={e => setF({ ...f, schedule: e.target.value })} className="rs-select">
          {SCHEDULES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="number" value={f.xp} onChange={e => setF({ ...f, xp: +e.target.value })} className="rs-input w-16 text-[11px]" min={1} />
        <label className="flex items-center gap-1 text-[10px] text-rs-parchment-dark cursor-pointer">
          <input type="checkbox" checked={f.keystone} onChange={e => setF({ ...f, keystone: e.target.checked })} /> Keystone
        </label>
        <label className="flex items-center gap-1 text-[10px] text-rs-parchment-dark cursor-pointer">
          <input type="checkbox" checked={f.mvd} onChange={e => setF({ ...f, mvd: e.target.checked })} /> MVD
        </label>
        <label className="flex items-center gap-1 text-[10px] text-rs-parchment-dark cursor-pointer">
          <input type="checkbox" checked={f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> Active
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="rs-btn text-[10px]">Save</button>
        <button onClick={onCancel} className="rs-btn text-[10px]">Cancel</button>
        <button onClick={onDelete} className="rs-btn rs-btn-danger text-[10px] ml-auto">Delete</button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState('dashboard')
  const { habits, addHabit, updateHabit, deleteHabit, reorderHabit, resetHabits } = useHabits()
  const { today, template, todayHabits, log, dayLogs, toggleHabit, setStateTag } = useDayLog(habits)
  const { overall, packStreaks } = useStreaks(dayLogs, habits, today)
  const xp = calcXP(todayHabits, log.completed)
  const mvdHabits = todayHabits.filter(h => h.mvd)
  const mvdComplete = isMvdComplete(todayHabits, log.completed)
  const allComplete = xp.habitsComplete === xp.habitsTotal && xp.habitsTotal > 0

  const totalXP = useMemo(() =>
    Object.values(dayLogs).reduce((sum, l) => sum + (l.xpEarned || 0), 0) + xp.xpEarned
  , [dayLogs, xp.xpEarned])
  const levelInfo = useMemo(() => getLevel(totalXP), [totalXP])

  // Celebration
  const [celebration, setCelebration] = useState(null)
  const prevComplete = useRef(false)
  useEffect(() => {
    if (allComplete && !prevComplete.current) {
      const milestones = [100, 60, 30, 14, 7]
      for (const m of milestones) {
        if (overall === m) { setCelebration(CELEBRATIONS.streak[m]); prevComplete.current = true; return }
      }
      setCelebration(pickRandom(CELEBRATIONS.daily))
    }
    prevComplete.current = allComplete
  }, [allComplete, overall])

  // Settings page
  if (page === 'settings') {
    return (
      <SettingsView
        habits={habits} onUpdate={updateHabit} onAdd={addHabit}
        onDelete={deleteHabit} onReorder={reorderHabit} onReset={resetHabits}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  return (
    <div className="rs-page-bg min-h-screen flex flex-col">
      {/* ── HEADER BAR ── */}
      <header className="rs-panel m-2 mb-0" style={{ borderRadius: '4px 4px 0 0' }}>
        <div className="flex items-center gap-4 px-4 py-2.5">
          <h1 className="font-['MedievalSharp'] text-xl rs-gold-bright tracking-wide flex-shrink-0">
            Mission Dashboard
          </h1>
          <div className="rs-divider flex-1 my-0" style={{ height: '1px' }} />
          <span className="text-xs text-rs-parchment-dark">{formatDateShort(today)}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-sm border font-bold ${
            template === 'workday' ? 'border-blue-800 text-blue-300 bg-blue-900/30'
            : template === 'sunday' ? 'border-rs-gold/40 text-rs-gold bg-rs-gold/10'
            : 'border-purple-800 text-purple-300 bg-purple-900/30'
          }`}>
            {TEMPLATE_LABELS[template]}
          </span>
          <button onClick={() => setPage('settings')} className="rs-btn text-[10px] py-1 px-3" title="Settings">
            &#9881; Settings
          </button>
        </div>
      </header>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-2 p-2 min-h-0">

        {/* LEFT — Character Stats */}
        <Panel title="Character" icon="&#9876;" bodyClass="overflow-y-auto" className="hidden lg:block">
          <CharacterPanel
            xp={xp} levelInfo={levelInfo} totalXP={totalXP}
            streak={overall} mvdComplete={mvdComplete}
            mvdHabits={mvdHabits} completedIds={log.completed}
            stateTag={log.stateTag} onStateTag={setStateTag}
          />
        </Panel>

        {/* CENTER — Quest Log */}
        <Panel title="Daily Quests" icon="&#128220;" bodyClass="p-0">
          {/* Mobile-only stats bar */}
          <div className="lg:hidden p-3 border-b border-rs-border/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-['Press_Start_2P'] text-sm rs-gold-bright">Lv.{levelInfo.level}</span>
                <span className={`text-lg ${overall > 0 ? 'rs-fire' : ''}`}>{overall > 0 ? '\u{1F525}' : ''}</span>
                <span className="font-['Press_Start_2P'] text-[10px] rs-gold">{overall}d</span>
              </div>
              <span className="font-['Press_Start_2P'] text-[10px] rs-gold">{xp.habitsComplete}/{xp.habitsTotal}</span>
            </div>
            <XPBar current={xp.xpEarned} max={xp.xpPossibleMax} gold={xp.keystoneBonus} />
          </div>
          <QuestLog todayHabits={todayHabits} log={log} onToggle={toggleHabit} />
        </Panel>

        {/* RIGHT — Progress */}
        <div className="space-y-2">
          <Panel title="Streaks" icon="&#128293;">
            <StreakPanel overall={overall} packStreaks={packStreaks} />
          </Panel>
          <Panel title="This Week" icon="&#128197;">
            <WeeklyTracker dayLogs={dayLogs} today={today} />
          </Panel>
          <Panel title={formatMonthYear(today)} icon="&#128467;">
            <MonthlyCalendar dayLogs={dayLogs} today={today} />
          </Panel>
        </div>
      </div>

      {/* ── QUEST COMPLETE OVERLAY ── */}
      <QuestCompleteBanner
        show={!!celebration}
        message={celebration}
        onDismiss={() => setCelebration(null)}
      />
    </div>
  )
}
