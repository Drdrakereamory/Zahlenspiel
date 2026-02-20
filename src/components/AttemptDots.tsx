import { CONFIG } from '../config'
import { DotState } from '../types'

interface Props {
  dotStates: DotState[]
  attempt: number
}

export default function AttemptDots({ dotStates, attempt }: Props) {
  return (
    <div className="flex gap-1 flex-1">
      {Array.from({ length: CONFIG.maxAttempts }, (_, i) => {
        const state = dotStates[i]
        const isSpecial = CONFIG.modeMap[i + 1] !== 'normal'
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
        } else if (isSpecial) {
          className += 'bg-card-border'
          // special-pending: striped pattern via inline style
        } else {
          className += 'bg-card-border'
        }

        const style: React.CSSProperties = (!isActive && state === 'pending' && isSpecial)
          ? {
              background: 'repeating-linear-gradient(45deg, #5a1068, #5a1068 3px, #401a1a 3px, #401a1a 6px)',
            }
          : {}

        return <div key={i} className={className} style={style} />
      })}
    </div>
  )
}
