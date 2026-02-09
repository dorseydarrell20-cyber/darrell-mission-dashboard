import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dmb-wallpaper'

export const GRADIENT_PRESETS = [
  {
    id: 'midnight',
    name: 'Midnight',
    css: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    css: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 25%, #16213e 50%, #0a2e1a 75%, #0d0d0d 100%)',
  },
  {
    id: 'ember',
    name: 'Ember',
    css: 'linear-gradient(135deg, #0d0d0d 0%, #2e1a0a 30%, #1a0a0a 60%, #0d0d0d 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    css: 'linear-gradient(135deg, #020617 0%, #0c1929 30%, #0e2a3d 60%, #0a2540 100%)',
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    css: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 30%, #2d1b4e 50%, #1a0a2e 70%, #0d0d0d 100%)',
  },
  {
    id: 'void',
    name: 'Void',
    css: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    css: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 20%, #2e0a3d 40%, #1a0a2e 60%, #0a1a2e 80%, #0a0a1a 100%)',
  },
  {
    id: 'forest',
    name: 'Forest',
    css: 'linear-gradient(135deg, #0a0d0a 0%, #0d1a0d 30%, #1a2e1a 50%, #0d1a0d 70%, #0a0d0a 100%)',
  },
]

export function useWallpaper() {
  const [wallpaper, setWallpaperState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return { type: 'gradient', id: 'midnight', css: GRADIENT_PRESETS[0].css }
  })

  useEffect(() => {
    // Don't store base64 images larger than 2MB in localStorage
    if (wallpaper.type === 'image' && wallpaper.css && wallpaper.css.length > 2_000_000) {
      // Store reference but not the actual data
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...wallpaper, css: wallpaper.css }))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallpaper))
    }
  }, [wallpaper])

  function setGradient(preset) {
    setWallpaperState({ type: 'gradient', id: preset.id, css: preset.css })
  }

  function setCustomImage(dataUrl) {
    setWallpaperState({ type: 'image', id: 'custom', css: dataUrl })
  }

  function getBackgroundStyle() {
    if (wallpaper.type === 'image') {
      return { backgroundImage: `url(${wallpaper.css})` }
    }
    return { background: wallpaper.css }
  }

  return { wallpaper, setGradient, setCustomImage, getBackgroundStyle }
}
