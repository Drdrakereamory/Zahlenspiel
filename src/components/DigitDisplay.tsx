interface Props {
  digits: number
  value: string
  resultState?: 'correct' | 'wrong' | null
}

export default function DigitDisplay({ digits, value, resultState }: Props) {
  return (
    <div className="flex justify-center gap-1.5 sm:gap-2.5 mb-2 cursor-text">
      {Array.from({ length: digits }, (_, i) => {
        const char = value[i]
        const isFilled = i < value.length
        const isActive = i === value.length && !resultState

        let slotClass =
          'flex items-center justify-center w-[56px] h-[76px] sm:w-[72px] sm:h-[92px] rounded-xl border-2 ' +
          'font-display text-[48px] sm:text-[62px] transition-all duration-200 select-none bg-input-bg '

        if (resultState === 'correct') {
          slotClass += 'border-amber bg-[rgba(251,191,36,0.1)] text-amber'
        } else if (resultState === 'wrong') {
          slotClass += 'border-red text-red animate-shake'
        } else if (isFilled) {
          slotClass += 'border-amber-dim text-amber animate-digitPop'
        } else if (isActive) {
          slotClass += 'border-orange text-text-muted'
        } else {
          slotClass += 'border-card-border text-text-muted'
        }

        return (
          <span key={i} className={slotClass}>
            {char ?? '_'}
          </span>
        )
      })}
    </div>
  )
}
