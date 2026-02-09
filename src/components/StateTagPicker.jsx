import { useState } from 'react'
import { STATE_TAGS } from '../data/stateTags'

export default function StateTagPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = STATE_TAGS.find(t => t.label === value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-light glass-hover text-sm transition-all duration-200"
      >
        <span>{current ? current.emoji : '\u{1F3AF}'}</span>
        <span className="text-white/60 text-xs">{current ? current.label : 'State'}</span>
        <svg className="w-3 h-3 text-white/20 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-20 glass rounded-xl shadow-2xl py-1.5 min-w-[170px] ring-1 ring-white/10">
            {value && (
              <button
                onClick={() => { onChange(null); setOpen(false) }}
                className="w-full text-left px-3.5 py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
              >
                Clear
              </button>
            )}
            {STATE_TAGS.map(tag => (
              <button
                key={tag.label}
                onClick={() => { onChange(tag.label); setOpen(false) }}
                className={`w-full text-left px-3.5 py-2 text-sm hover:bg-white/5 flex items-center gap-2.5 transition-colors ${
                  value === tag.label ? 'text-white' : 'text-white/60'
                }`}
              >
                <span>{tag.emoji}</span>
                <span className="text-xs">{tag.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
