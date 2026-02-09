import { useState, useEffect } from 'react'
import { CELEBRATIONS } from '../data/celebrations'
import { isDayComplete } from '../utils/scoring'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function CelebrationBanner({ log, streak }) {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!log) return

    const complete = isDayComplete(log)
    if (!complete) {
      setMessage(null)
      setVisible(false)
      return
    }

    // Check streak milestones first
    const milestones = [100, 60, 30, 14, 7]
    for (const m of milestones) {
      if (streak === m) {
        setMessage({ text: CELEBRATIONS.streak[m], type: 'hype' })
        setVisible(true)
        return
      }
    }

    setMessage({ text: pickRandom(CELEBRATIONS.daily), type: 'stoic' })
    setVisible(true)
  }, [log?.xpEarned, log?.xpPossible, streak])

  if (!message || !visible) return null

  return (
    <div className={`animate-slide-up relative overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-500 ${
      message.type === 'hype'
        ? 'glass ring-1 ring-amber-500/30 glow-amber'
        : 'glass ring-1 ring-white/10'
    }`}>
      {/* Decorative accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        message.type === 'hype'
          ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent'
          : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
      }`} />

      <button
        onClick={() => setVisible(false)}
        className="absolute top-2.5 right-3 text-white/20 hover:text-white/50 text-xs transition-colors"
      >
        &#10005;
      </button>
      <p className={`text-sm font-medium pr-6 ${
        message.type === 'hype' ? 'text-amber-300' : 'text-white/70'
      }`}>
        {message.text}
      </p>
    </div>
  )
}
