import { useRef, useEffect } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  equation: string
  digits: number
  value: string
  resultState: 'correct' | 'wrong' | null
  onInput: (val: string) => void
}

export default function BrainZone({ equation, digits, value, resultState, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [equation])

  return (
    <div className="px-5 pb-5" onClick={() => inputRef.current?.focus()}>
      <div className="bg-[rgba(32,176,154,0.08)] border border-teal-dim rounded-xl p-5 text-center mb-3.5">
        <div className="font-display text-[36px] sm:text-[46px] text-teal tracking-[3px] sm:tracking-[4px]">{equation}</div>
        <div className="text-[11px] text-teal opacity-70 mt-1 tracking-[1px] uppercase">
          Ergebnis eingeben — kein Enter nötig
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
