import { useRef, useEffect } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  digits: number
  value: string
  resultState: 'correct' | 'wrong' | null
  onInput: (val: string) => void
}

export default function NormalZone({ digits, value, resultState, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, []) // runs once on mount (component is remounted per attempt via key prop)

  return (
    <div className="px-5 pb-5">
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
      <p className="text-center text-[11px] text-text-secondary mt-1 font-bold tracking-widest uppercase">
        Einfach tippen — automatische Auswertung
      </p>
    </div>
  )
}
