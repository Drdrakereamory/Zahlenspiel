import { GameMode } from '../types'
import { CONFIG } from '../config'

interface ModeIntroData {
  title: string
  subtitle: string
  description: string
  color: string
  bgColor: string
  borderClass: string
  barClass: string
  textClass: string
}

const modeIntroData: Record<GameMode, ModeIntroData> = {
  normal: {
    title: 'GUESS',
    subtitle: 'Type your answer.',
    description: 'Type the exact number. Auto-submits when all digits are filled.',
    color: '#fbbf24', bgColor: 'rgba(251,191,36,0.10)', borderClass: 'border-amber-dim', barClass: 'bg-amber', textClass: 'text-amber',
  },
  slot: {
    title: 'SLOT MACHINE',
    subtitle: 'Spin. Accept. Pray.',
    description: 'You have no control — hit the button and let fate pick a number for you. Accept whatever it lands on.',
    color: '#f97316', bgColor: 'rgba(249,115,22,0.10)', borderClass: 'border-orange-dim', barClass: 'bg-orange', textClass: 'text-orange',
  },
  choice: {
    title: '1 OF 10',
    subtitle: 'Ten numbers. One truth.',
    description: 'Ten numbers are shown. Exactly one is the correct answer. Pick the right one — no second chances.',
    color: '#d946ef', bgColor: 'rgba(217,70,239,0.10)', borderClass: 'border-magenta-dim', barClass: 'bg-magenta', textClass: 'text-magenta',
  },
  brain: {
    title: 'BRAIN MODE',
    subtitle: 'Think. Solve. Type.',
    description: 'A math equation is on screen — solve it in your head and type the answer before time runs out.',
    color: '#2dd4bf', bgColor: 'rgba(45,212,191,0.10)', borderClass: 'border-teal-dim', barClass: 'bg-teal', textClass: 'text-teal',
  },
  range: {
    title: 'RANGE HINT',
    subtitle: 'It\'s hiding in there.',
    description: 'A tight number range is shown. The exact answer hides somewhere inside — find it.',
    color: '#fbbf24', bgColor: 'rgba(251,191,36,0.10)', borderClass: 'border-amber-dim', barClass: 'bg-amber', textClass: 'text-amber',
  },
  mirror: {
    title: 'MIRROR',
    subtitle: 'Reversed. Flip it back.',
    description: 'Your number is shown with its digits in reverse order. Read it, flip it in your head, type the real number.',
    color: '#6366f1', bgColor: 'rgba(99,102,241,0.10)', borderClass: 'border-indigo-dim', barClass: 'bg-indigo', textClass: 'text-indigo',
  },
  quiz: {
    title: 'QUIZ',
    subtitle: 'Read. Think. Answer.',
    description: 'A word problem is on screen. Solve it in your head — the answer is a number. Type it before time runs out.',
    color: '#84cc16', bgColor: 'rgba(132,204,22,0.10)', borderClass: 'border-lime-dim', barClass: 'bg-lime', textClass: 'text-lime',
  },
}

function ModeIcon({ mode, color }: { mode: GameMode; color: string }) {
  const s = { stroke: color }
  if (mode === 'slot') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
    </svg>
  )
  if (mode === 'choice') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
  if (mode === 'brain') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
    </svg>
  )
  if (mode === 'range') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d="M22 12H2"/><path d="m15 5 7 7-7 7"/><path d="m9 5-7 7 7 7"/>
    </svg>
  )
  if (mode === 'mirror') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18"/>
    </svg>
  )
  if (mode === 'quiz') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <path d="M9 18h6"/><path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  )
  // default (normal)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={s}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

interface Props {
  mode: GameMode
  timeLeft: number
  onSkip: () => void
}

export default function ModeIntroScreen({ mode, timeLeft, onSkip }: Props) {
  const data = modeIntroData[mode]
  const totalTime = CONFIG.modeIntroTimes[mode]
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const secondsDisplay = Math.ceil(timeLeft)

  return (
    <div className="animate-fadeUp" onClick={onSkip}>
      <div
        className={`bg-card rounded-2xl px-7 py-10 border shadow-[0_4px_32px_rgba(0,0,0,0.5)] text-center select-none cursor-pointer ${data.borderClass}`}
        style={{ background: `linear-gradient(160deg, ${data.bgColor} 0%, rgba(19,19,30,1) 60%)` }}
      >
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-[72px] h-[72px] rounded-full mb-5 border ${data.borderClass}`}
          style={{ background: data.bgColor }}
        >
          <ModeIcon mode={mode} color={data.color} />
        </div>

        {/* Title */}
        <div
          className="font-display text-[42px] sm:text-[52px] tracking-[3px] leading-none mb-1"
          style={{ color: data.color }}
        >
          {data.title}
        </div>

        {/* Subtitle */}
        <div className={`text-[13px] font-extrabold tracking-[2px] uppercase mb-5 ${data.textClass} opacity-70`}>
          {data.subtitle}
        </div>

        {/* Description */}
        <div className="text-[15px] text-text-secondary leading-[1.75] mb-7 max-w-[320px] mx-auto">
          {data.description}
        </div>

        {/* Countdown bar */}
        <div className="mb-2">
          <div className="h-[4px] rounded-full bg-card-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-none ${data.barClass}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`flex justify-between text-[11px] mt-1.5 font-semibold tracking-[1px] uppercase opacity-60 ${data.textClass}`}>
            <span>Starts in {secondsDisplay}s</span>
            <span>Tap to skip</span>
          </div>
        </div>
      </div>
    </div>
  )
}
