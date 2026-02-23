import { useRef, useEffect } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  secret: number
  digits: number
  levelMin: number
  levelMax: number
  value: string
  resultState: 'correct' | 'wrong' | null
  onInput: (val: string) => void
}

export default function RangeZone({ secret, digits, levelMin, levelMax, value, resultState, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const spread = levelMax <= 99 ? 10 : levelMax <= 999 ? 40 : 150
  const lo = Math.max(levelMin, secret - spread)
  const hi = Math.min(levelMax, secret + spread)

  return (
    <div className="px-5 pb-5" onClick={() => inputRef.current?.focus()}>
      <div className="bg-[rgba(251,191,36,0.08)] border border-amber-dim rounded-xl p-5 text-center mb-3.5">
        <div className="text-[12px] text-amber opacity-70 uppercase tracking-[1.5px] mb-1">The number is between</div>
        <div className="font-display text-[36px] sm:text-[46px] text-amber tracking-[3px]">
          {lo} — {hi}
        </div>
        <div className="text-[11px] text-amber opacity-60 mt-1 tracking-[1px] uppercase">
          Type the exact number
        </div>
      </div>
      <DigitDisplay digits={digits} value={value} resultState={resultState} />
      <input
        ref={inputRef}
        type="number"
        className="hidden-input"
        autoComplete="off"
        inputMode="numeric"
        value={value}
        onChange={e => onInput(e.target.value)}
      />
    </div>
  )
}
