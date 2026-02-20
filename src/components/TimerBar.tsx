import { CONFIG } from '../config'

interface Props {
  timerLeft: number
}

export default function TimerBar({ timerLeft }: Props) {
  const pct = timerLeft / CONFIG.timerSeconds
  const isDanger = pct <= 0.3
  const isWarn = !isDanger && pct <= 0.55

  const numClass = `font-display text-[32px] w-10 transition-colors duration-300 ${
    isDanger ? 'text-red animate-timerPulse' : isWarn ? 'text-amber' : 'text-text-primary'
  }`

  const fillClass = `h-full rounded-full transition-[width,background-color] duration-100 ${
    isDanger ? 'bg-red' : isWarn ? 'bg-amber' : 'bg-orange'
  }`

  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <div className={numClass}>{Math.max(0, Math.ceil(timerLeft))}</div>
      <div className="flex-1 h-1.5 bg-card-border rounded-full overflow-hidden">
        <div
          className={fillClass}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
