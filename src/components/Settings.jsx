import { useState, useRef } from 'react'
import { PACKS, PACK_ORDER } from '../data/packs'
import { exportAllData, importAllData, clearAllData } from '../utils/storage'
import WallpaperPicker from './WallpaperPicker'

const SCHEDULES = ['workday', 'offday', 'both', 'sunday']

export default function Settings({
  habits, onUpdate, onAdd, onDelete, onReorder, onReset, onNavigateBack,
  wallpaper, onSelectGradient, onSelectImage,
}) {
  const [editingId, setEditingId] = useState(null)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef()

  function handleExport() {
    const data = exportAllData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mission-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        importAllData(ev.target.result)
        setImportMsg('Data imported. Reload to apply.')
        setTimeout(() => window.location.reload(), 1000)
      } catch {
        setImportMsg('Invalid file format.')
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    clearAllData()
    onReset()
    setShowConfirmReset(false)
    window.location.reload()
  }

  function handleAddHabit() {
    onAdd({
      name: 'New habit',
      pack: 'builder',
      xp: 10,
      schedule: 'both',
      keystone: false,
      mvd: false,
      active: true,
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass rounded-2xl px-5 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white tracking-tight">Settings</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Wallpaper */}
      <div className="glass rounded-2xl p-4">
        <WallpaperPicker
          wallpaper={wallpaper}
          onSelectGradient={onSelectGradient}
          onSelectImage={onSelectImage}
        />
      </div>

      {/* Habit Editor */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/50">Habits</h3>
          <button
            onClick={handleAddHabit}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors ring-1 ring-blue-500/20"
          >
            + Add Habit
          </button>
        </div>

        <div className="space-y-1">
          {PACK_ORDER.map(packKey => {
            const packHabits = habits.filter(h => h.pack === packKey)
            if (packHabits.length === 0) return null
            const pack = PACKS[packKey]

            return (
              <div key={packKey} className="mb-4">
                <div className="text-[10px] text-white/30 mb-2 flex items-center gap-1.5 uppercase tracking-widest font-medium">
                  <span>{pack.emoji}</span> {pack.name}
                </div>
                {packHabits.map(habit => (
                  <div key={habit.id} className="mb-1.5">
                    {editingId === habit.id ? (
                      <HabitEditor
                        habit={habit}
                        onSave={(updates) => { onUpdate(habit.id, updates); setEditingId(null) }}
                        onCancel={() => setEditingId(null)}
                        onDelete={() => { onDelete(habit.id); setEditingId(null) }}
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light glass-hover ring-1 ring-white/[0.03] group transition-all duration-200">
                        <div className="flex gap-0.5">
                          <button
                            onClick={() => onReorder(habit.id, 'up')}
                            className="text-white/15 hover:text-white/60 text-xs px-0.5 transition-colors"
                          >&uarr;</button>
                          <button
                            onClick={() => onReorder(habit.id, 'down')}
                            className="text-white/15 hover:text-white/60 text-xs px-0.5 transition-colors"
                          >&darr;</button>
                        </div>
                        <span className={`flex-1 text-sm ${habit.active ? 'text-white/70' : 'text-white/25'}`}>
                          {habit.name}
                        </span>
                        {habit.keystone && <span className="text-amber-400 text-xs">&#9733;</span>}
                        {habit.mvd && <span className="text-[9px] text-amber-400/80 font-medium">MVD</span>}
                        <span className="text-[9px] text-white/20 font-mono">{habit.schedule}</span>
                        <button
                          onClick={() => setEditingId(habit.id)}
                          className="text-[10px] text-white/20 hover:text-white/70 transition-all opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded bg-white/5"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Data */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-white/50">Data</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-xs px-3.5 py-2 rounded-lg glass-light glass-hover text-white/60 transition-all duration-200"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs px-3.5 py-2 rounded-lg glass-light glass-hover text-white/60 transition-all duration-200"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        {importMsg && <p className="text-xs text-amber-400">{importMsg}</p>}

        <div className="border-t border-white/5 pt-3 mt-3">
          {showConfirmReset ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-red-400/80">Reset all data? This cannot be undone.</span>
              <button
                onClick={handleReset}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors ring-1 ring-red-500/20"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="text-xs px-3 py-1.5 rounded-lg glass-light text-white/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs px-3.5 py-2 rounded-lg glass-light text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              Reset All Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function HabitEditor({ habit, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({ ...habit })

  return (
    <div className="p-3.5 rounded-xl glass ring-1 ring-white/10 space-y-3">
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-blue-500/50 transition-colors"
        placeholder="Habit name"
      />
      <div className="flex gap-2 flex-wrap">
        <select
          value={form.pack}
          onChange={e => setForm({ ...form, pack: e.target.value })}
          className="bg-white/5 ring-1 ring-white/10 rounded-lg px-2 py-1.5 text-xs text-white/70 focus:outline-none appearance-none cursor-pointer"
        >
          {PACK_ORDER.map(p => (
            <option key={p} value={p} className="bg-gray-900">{PACKS[p].emoji} {PACKS[p].name}</option>
          ))}
        </select>
        <select
          value={form.schedule}
          onChange={e => setForm({ ...form, schedule: e.target.value })}
          className="bg-white/5 ring-1 ring-white/10 rounded-lg px-2 py-1.5 text-xs text-white/70 focus:outline-none appearance-none cursor-pointer"
        >
          {SCHEDULES.map(s => (
            <option key={s} value={s} className="bg-gray-900">{s}</option>
          ))}
        </select>
        <input
          type="number"
          value={form.xp}
          onChange={e => setForm({ ...form, xp: Number(e.target.value) })}
          className="w-16 bg-white/5 ring-1 ring-white/10 rounded-lg px-2 py-1.5 text-xs text-white/70 focus:outline-none"
          min={1}
        />
        <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer">
          <input type="checkbox" checked={form.keystone} onChange={e => setForm({ ...form, keystone: e.target.checked })} className="rounded" />
          Keystone
        </label>
        <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer">
          <input type="checkbox" checked={form.mvd} onChange={e => setForm({ ...form, mvd: e.target.checked })} className="rounded" />
          MVD
        </label>
        <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded" />
          Active
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 ring-1 ring-blue-500/20 transition-colors">Save</button>
        <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded-lg glass-light text-white/40 transition-colors">Cancel</button>
        <button onClick={onDelete} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 ml-auto transition-colors">Delete</button>
      </div>
    </div>
  )
}
