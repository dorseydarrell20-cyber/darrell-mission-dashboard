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

    // Check streak milestones first (higher priority)
    const milestones = [100, 60, 30, 14, 7]
    for (const m of milestones) {
      if (streak === m) {
        setMessage({ text: CELEBRATIONS.streak[m], type: 'hype' })
        setVisible(true)
        return
      }
    }

    // Daily completion
    setMessage({ text: pickRandom(CELEBRATIONS.daily), type: 'stoic' })
    setVisible(true)
  }, [log?.xpEarned, log?.xpPossible, streak])

  if (!message || !visible) return null

  return (
    <div
      className={`relative overflow-hidden rounded-lg border px-4 py-3 transition-all duration-500 ${
        message.type === 'hype'
          ? 'border-amber-700 bg-gradient-to-r from-amber-950/80 to-orange-950/80'
          : 'border-gray-700 bg-gray-800/80'
      }`}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 text-xs"
      >
        &#10005;
      </button>
      <p className={`text-sm font-medium ${
        message.type === 'hype' ? 'text-amber-300' : 'text-gray-300'
      }`}>
        {message.text}
      </p>
    </div>
  )
}
