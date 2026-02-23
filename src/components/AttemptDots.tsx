import { CONFIG } from '../config'
import { DotState, GameMode } from '../types'

interface Props {
  dotStates: DotState[]
  attempt: number
  modeMap: Record<number, GameMode>
}

export default function AttemptDots({ dotStates, attempt, modeMap }: Props) {
  return (
    <div className="flex gap-1 flex-1">
      {Array.from({ length: CONFIG.maxAttempts }, (_, i) => {
        const state = dotStates[i]
        const isSpecial = modeMap[i + 1] !== 'normal'
        const isActive = i === attempt - 1 && state === 'pending'

        let className = 'flex-1 h-[7px] rounded-full transition-all duration-300 '

        if (state === 'correct') {
          className += 'bg-amber'
        } else if (state === 'wrong') {
          className += 'bg-red'
        } else if (state === 'timeout') {
          className += 'bg-text-muted'
        } else if (isActive) {
          className += 'bg-orange animate-pulseAnim'
        } else {
          className += 'bg-card-border'
        }

        const style: React.CSSProperties = (!isActive && state === 'pending' && isSpecial)
          ? {
              background: 'repeating-linear-gradient(45deg, #3b0b45, #3b0b45 3px, #1e1e30 3px, #1e1e30 6px)',
            }
          : {}

        return <div key={i} className={className} style={style} />
      })}
    </div>
  )
}
