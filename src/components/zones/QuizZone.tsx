import { useRef, useEffect } from 'react'
import DigitDisplay from '../DigitDisplay'

interface Props {
  question: string
  digits: number
  value: string
  resultState: 'correct' | 'wrong' | null
  onInput: (val: string) => void
}

export default function QuizZone({ question, digits, value, resultState, onInput }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [question])

  return (
    <div className="px-5 pb-5" onClick={() => inputRef.current?.focus()}>
      <div className="bg-[rgba(132,204,22,0.08)] border border-lime-dim rounded-xl p-5 text-center mb-3.5">
        <div className="text-[12px] text-lime opacity-70 uppercase tracking-[1.5px] mb-3">Solve the riddle</div>
        <div className="text-[16px] sm:text-[18px] text-text-primary leading-[1.65] font-semibold mb-2">
          {question}
        </div>
        <div className="text-[11px] text-lime opacity-60 mt-2 tracking-[1px] uppercase">
          Type the answer — no Enter needed
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
