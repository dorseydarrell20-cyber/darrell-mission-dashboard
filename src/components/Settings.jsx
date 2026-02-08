import { useState, useRef } from 'react'
import { PACKS, PACK_ORDER } from '../data/packs'
import { exportAllData, importAllData, clearAllData } from '../utils/storage'

const SCHEDULES = ['workday', 'offday', 'both', 'sunday']

export default function Settings({ habits, onUpdate, onAdd, onDelete, onReorder, onReset, onNavigateBack }) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <button
          onClick={onNavigateBack}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back
        </button>
      </div>

      {/* Habit Editor */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400">Habits</h3>
          <button
            onClick={handleAddHabit}
            className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
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
                <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  <span>{pack.emoji}</span> {pack.name}
                </div>
                {packHabits.map(habit => (
                  <div key={habit.id} className="mb-1">
                    {editingId === habit.id ? (
                      <HabitEditor
                        habit={habit}
                        onSave={(updates) => { onUpdate(habit.id, updates); setEditingId(null) }}
                        onCancel={() => setEditingId(null)}
                        onDelete={() => { onDelete(habit.id); setEditingId(null) }}
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-900/50 border border-gray-800 group">
                        <div className="flex gap-0.5">
                          <button
                            onClick={() => onReorder(habit.id, 'up')}
                            className="text-gray-600 hover:text-gray-300 text-xs px-0.5"
                          >&uarr;</button>
                          <button
                            onClick={() => onReorder(habit.id, 'down')}
                            className="text-gray-600 hover:text-gray-300 text-xs px-0.5"
                          >&darr;</button>
                        </div>
                        <span className={`flex-1 text-sm ${habit.active ? 'text-gray-200' : 'text-gray-600'}`}>
                          {habit.name}
                        </span>
                        {habit.keystone && <span className="text-amber-400 text-xs">&#9733;</span>}
                        {habit.mvd && <span className="text-[10px] text-amber-400">MVD</span>}
                        <span className="text-[10px] text-gray-600">{habit.schedule}</span>
                        <button
                          onClick={() => setEditingId(habit.id)}
                          className="text-xs text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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

      {/* Export / Import */}
      <div className="border-t border-gray-800 pt-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Data</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        {importMsg && <p className="text-xs text-amber-400">{importMsg}</p>}
      </div>

      {/* Reset */}
      <div className="border-t border-gray-800 pt-4">
        {showConfirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400">Reset all data? This cannot be undone.</span>
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>
    </div>
  )
}

function HabitEditor({ habit, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({ ...habit })

  return (
    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700 space-y-2">
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
        placeholder="Habit name"
      />
      <div className="flex gap-2 flex-wrap">
        <select
          value={form.pack}
          onChange={e => setForm({ ...form, pack: e.target.value })}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
        >
          {PACK_ORDER.map(p => (
            <option key={p} value={p}>{PACKS[p].emoji} {PACKS[p].name}</option>
          ))}
        </select>
        <select
          value={form.schedule}
          onChange={e => setForm({ ...form, schedule: e.target.value })}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
        >
          {SCHEDULES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="number"
          value={form.xp}
          onChange={e => setForm({ ...form, xp: Number(e.target.value) })}
          className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
          min={1}
        />
        <label className="flex items-center gap-1 text-xs text-gray-400">
          <input type="checkbox" checked={form.keystone} onChange={e => setForm({ ...form, keystone: e.target.checked })} />
          Keystone
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-400">
          <input type="checkbox" checked={form.mvd} onChange={e => setForm({ ...form, mvd: e.target.checked })} />
          MVD
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-400">
          <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
          Active
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white">Save</button>
        <button onClick={onCancel} className="text-xs px-2.5 py-1 rounded bg-gray-700 text-gray-300">Cancel</button>
        <button onClick={onDelete} className="text-xs px-2.5 py-1 rounded bg-red-900/50 text-red-400 hover:bg-red-900 ml-auto">Delete</button>
      </div>
    </div>
  )
}
