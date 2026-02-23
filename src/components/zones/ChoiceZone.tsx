import { useEffect, useRef, useState } from 'react'

interface Props {
  options: number[]
  secret: number
  onPick: (val: number) => void
  done: boolean
}

export default function ChoiceZone({ options, secret, onPick, done }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [focusIdx, setFocusIdx] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setPicked(null)
    setFocusIdx(0)
    const t = setTimeout(() => btnRefs.current[0]?.focus(), 80)
    return () => clearTimeout(t)
  }, [options])

  useEffect(() => {
    btnRefs.current[focusIdx]?.focus()
  }, [focusIdx])

  const handlePick = (val: number, idx: number) => {
    if (done || picked !== null) return
    setPicked(val)
    setFocusIdx(idx)
    onPick(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (done || picked !== null) return
    const len = options.length
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx((focusIdx + 1) % len)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx((focusIdx - 1 + len) % len)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePick(options[focusIdx], focusIdx)
    } else if (e.key >= '0' && e.key <= '9') {
      const match = options.findIndex(o => String(o).startsWith(e.key))
      if (match !== -1) setFocusIdx(match)
    }
  }

  return (
    <div className="px-5 pb-5" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-5 gap-[7px]">
        {options.map((n, idx) => {
          // Only highlight correct if the player picked it correctly
          const isCorrect = picked === n && n === secret
          const isWrong = picked === n && n !== secret

          let cls =
            'py-[14px] px-1 border-[1.5px] rounded-[9px] bg-input-bg font-display text-[26px] ' +
            'text-text-primary cursor-pointer transition-all duration-150 text-center outline-none '

          if (isCorrect) {
            cls += 'border-amber text-amber bg-[rgba(251,191,36,0.12)]'
          } else if (isWrong) {
            cls += 'border-red text-red bg-[rgba(239,68,68,0.12)] animate-shake'
          } else {
            cls += 'border-card-border hover:border-magenta hover:text-magenta hover:bg-[rgba(217,70,239,0.12)] hover:scale-[1.05] focus:border-magenta focus:text-magenta focus:bg-[rgba(217,70,239,0.12)]'
          }

          return (
            <button
              key={n}
              ref={el => { btnRefs.current[idx] = el }}
              className={cls}
              disabled={done || (picked !== null && n !== picked)}
              onClick={() => handlePick(n, idx)}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}
