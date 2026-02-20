import { useRef, useCallback } from 'react'

type SoundType = 'correct' | 'wrong' | 'timeout' | 'tick' | 'digit' | 'spin' | 'nav'

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const playSound = useCallback((type: SoundType) => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      if (type === 'correct') {
        ;[523, 659, 784, 1047].forEach((freq, i) => {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.connect(g); g.connect(ctx.destination)
          o.type = 'sine'; o.frequency.value = freq
          g.gain.setValueAtTime(0.25, now + i * 0.1)
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3)
          o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3)
        })
      } else if (type === 'wrong') {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(220, now)
        o.frequency.exponentialRampToValueAtTime(110, now + 0.25)
        g.gain.setValueAtTime(0.2, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        o.start(now); o.stop(now + 0.3)
      } else if (type === 'timeout') {
        ;[330, 220].forEach((freq, i) => {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.connect(g); g.connect(ctx.destination)
          o.type = 'square'; o.frequency.value = freq
          g.gain.setValueAtTime(0.1, now + i * 0.15)
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12)
          o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.15)
        })
      } else if (type === 'tick') {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sine'; o.frequency.value = 800
        g.gain.setValueAtTime(0.05, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
        o.start(now); o.stop(now + 0.07)
      } else if (type === 'digit') {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sine'; o.frequency.value = 600
        g.gain.setValueAtTime(0.07, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        o.start(now); o.stop(now + 0.06)
      } else if (type === 'spin') {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'triangle'
        o.frequency.setValueAtTime(400, now)
        o.frequency.exponentialRampToValueAtTime(200, now + 0.08)
        g.gain.setValueAtTime(0.1, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        o.start(now); o.stop(now + 0.1)
      } else if (type === 'nav') {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.type = 'sine'; o.frequency.value = 440
        g.gain.setValueAtTime(0.08, now)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        o.start(now); o.stop(now + 0.09)
      }
    } catch (_e) {
      // Ignore audio errors
    }
  }, [getCtx])

  return { playSound }
}
