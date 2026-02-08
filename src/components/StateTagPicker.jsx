import { useState } from 'react'
import { STATE_TAGS } from '../data/stateTags'

export default function StateTagPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = STATE_TAGS.find(t => t.label === value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 text-sm transition-colors"
      >
        <span>{current ? current.emoji : '\u{1F3AF}'}</span>
        <span className="text-gray-300">{current ? current.label : 'State'}</span>
        <svg className="w-3 h-3 text-gray-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[160px]">
            {value && (
              <button
                onClick={() => { onChange(null); setOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-700"
              >
                Clear
              </button>
            )}
            {STATE_TAGS.map(tag => (
              <button
                key={tag.label}
                onClick={() => { onChange(tag.label); setOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 flex items-center gap-2 ${
                  value === tag.label ? 'text-white' : 'text-gray-300'
                }`}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
