import { useRef, useEffect, useState } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  secret: number
  digits: number
  value: string
  resultState: 'correct' | 'wrong' | null
  shadowVisible: boolean
  onRevealDone: () => void
  onInput: (val: string) => void
}

const REVEAL_DURATION = 2000

export default function ShadowZone({ secret, digits, value, resultState, shadowVisible, onRevealDone, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(100)

  // Focus input when reveal ends
  useEffect(() => {
    if (shadowVisible) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [shadowVisible])

  // Countdown during reveal
  useEffect(() => {
    if (!shadowVisible) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / REVEAL_DURATION) * 100)
      setProgress(pct)
      if (pct <= 0) {
        clearInterval(interval)
        onRevealDone()
      }
    }, 50)
    setProgress(100)
    return () => clearInterval(interval)
  }, [shadowVisible, onRevealDone])

  return (
    <div className="px-5 pb-5" onClick={() => !shadowVisible && inputRef.current?.focus()}>
      {shadowVisible ? (
        <div className="bg-[rgba(239,68,68,0.08)] border border-red-dim rounded-xl p-5 text-center mb-3.5">
          <div className="text-[12px] text-red opacity-70 uppercase tracking-[1.5px] mb-2">Memorize this</div>
          <div className="font-display text-[52px] sm:text-[62px] text-red tracking-[6px] leading-none mb-3">
            {secret}
          </div>
          <div className="h-[3px] rounded-full bg-red-dim overflow-hidden">
            <div
              className="h-full bg-red rounded-full"
              style={{ width: `${progress}%`, transition: 'none' }}
            />
          </div>
          <div className="text-[11px] text-red opacity-60 mt-1.5 tracking-[1px] uppercase">
            Vanishes in 2 seconds
          </div>
        </div>
      ) : (
        <div className="bg-[rgba(239,68,68,0.08)] border border-red-dim rounded-xl p-5 text-center mb-3.5">
          <div className="text-[12px] text-red opacity-70 uppercase tracking-[1.5px] mb-2">From memory</div>
          <div className="font-display text-[52px] sm:text-[62px] tracking-[6px] leading-none mb-1 opacity-15" style={{ color: '#ef4444' }}>
            {'?'.repeat(digits)}
          </div>
          <div className="text-[11px] text-red opacity-60 mt-1 tracking-[1px] uppercase">
            Type what you saw
          </div>
        </div>
      )}
      {!shadowVisible && (
        <DigitDisplay digits={digits} value={value} resultState={resultState} />
      )}
      <input
        ref={inputRef}
        type="number"
        className="hidden-input"
        autoComplete="off"
        inputMode="numeric"
        value={value}
        disabled={shadowVisible}
        onChange={e => onInput(e.target.value)}
      />
    </div>
  )
}
