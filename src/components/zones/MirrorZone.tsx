import { useRef, useEffect } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  secret: number
  digits: number
  value: string
  resultState: 'correct' | 'wrong' | null
  onInput: (val: string) => void
}

export default function MirrorZone({ secret, digits, value, resultState, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const mirrored = String(secret).split('').reverse().join('')

  return (
    <div className="px-5 pb-5" onClick={() => inputRef.current?.focus()}>
      <div className="bg-[rgba(99,102,241,0.08)] border border-indigo-dim rounded-xl p-5 text-center mb-3.5">
        <div className="text-[12px] text-indigo opacity-70 uppercase tracking-[1.5px] mb-1">Reversed digits</div>
        <div className="font-display text-[36px] sm:text-[46px] text-indigo tracking-[6px]">
          {mirrored}
        </div>
        <div className="text-[11px] text-indigo opacity-60 mt-1 tracking-[1px] uppercase">
          Type the number in the correct order
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
