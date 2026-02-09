import { useRef } from 'react'
import { GRADIENT_PRESETS } from '../hooks/useWallpaper'

export default function WallpaperPicker({ wallpaper, onSelectGradient, onSelectImage }) {
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      onSelectImage(ev.target.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Wallpaper</h3>

      {/* Gradient presets */}
      <div className="grid grid-cols-4 gap-2">
        {GRADIENT_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelectGradient(preset)}
            className={`h-14 rounded-lg transition-all duration-200 ${
              wallpaper.id === preset.id
                ? 'ring-2 ring-white/40 scale-[1.02]'
                : 'ring-1 ring-white/10 hover:ring-white/25 hover:scale-[1.01]'
            }`}
            style={{ background: preset.css }}
            title={preset.name}
          >
            <span className="text-[9px] text-white/50 font-medium">{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Upload custom image */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 text-xs px-3 py-2.5 rounded-lg glass glass-hover text-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          Upload Your Art
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {wallpaper.type === 'image' && (
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg bg-cover bg-center ring-1 ring-white/10"
            style={{ backgroundImage: `url(${wallpaper.css})` }}
          />
          <span className="text-xs text-gray-400">Custom image active</span>
        </div>
      )}
    </div>
  )
}
