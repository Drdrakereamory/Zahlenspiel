import { GameMode } from '../types'

interface Props {
  onContinue: () => void
  modeMap: Record<number, GameMode>
}

const modeInfo: Record<GameMode, { label: string; desc: string; color: string; bgColor: string; borderClass: string }> = {
  normal: { label: 'Normal',       desc: 'Type your guess.',                      color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)',  borderClass: 'border-amber-dim' },
  slot:   { label: 'Slot Machine', desc: 'Spin the wheel — fate decides.',        color: '#f97316', bgColor: 'rgba(249,115,22,0.15)',  borderClass: 'border-orange-dim' },
  choice: { label: '1 of 10',      desc: 'Ten numbers — pick the right one.',     color: '#d946ef', bgColor: 'rgba(217,70,239,0.15)', borderClass: 'border-magenta-dim' },
  brain:  { label: 'Brain Mode',   desc: 'Solve the equation, type the answer.',  color: '#2dd4bf', bgColor: 'rgba(45,212,191,0.15)', borderClass: 'border-teal-dim' },
  range:  { label: 'Range Hint',   desc: 'A number range is shown — find it.',    color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)',  borderClass: 'border-amber-dim' },
  mirror: { label: 'Mirror',       desc: 'Digits are reversed — unscramble it.',  color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)',  borderClass: 'border-indigo-dim' },
  quiz:   { label: 'Quiz',         desc: 'Solve the word problem — type the answer.', color: '#84cc16', bgColor: 'rgba(132,204,22,0.15)', borderClass: 'border-lime-dim' },
}

export default function TransitionScreen({ onContinue, modeMap }: Props) {
  const chaosAttempts = [4, 5, 6, 7, 8].filter(n => modeMap[n] && modeMap[n] !== 'normal')

  return (
    <div className="animate-fadeUp">
      <div className="bg-card rounded-2xl px-7 py-10 border border-card-border shadow-[0_4px_32px_rgba(0,0,0,0.4)] text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-input-bg border border-orange-dim rounded-full text-orange mb-5 animate-bounceIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>

        <div className="font-display text-[34px] sm:text-[44px] tracking-[2px] sm:tracking-[3px] text-amber mb-2.5">CHAOS BEGINS</div>
        <div className="text-[14px] text-text-secondary leading-[1.7] mb-[22px]">
          The next attempts are no longer yours to control.<br />The algorithm plays along.
        </div>

        <div className="flex flex-col gap-[9px] mb-[22px] text-left">
          {chaosAttempts.map(n => {
            const mode = modeMap[n]
            const info = modeInfo[mode]
            return (
              <div
                key={n}
                className={`flex items-center gap-3 px-[14px] py-3 rounded-[10px] border ${info.borderClass}`}
                style={{ background: info.bgColor }}
              >
                <div className="shrink-0 w-2 h-2 rounded-full" style={{ background: info.color }} />
                <div className="text-[13px] font-semibold text-text-secondary">
                  <strong className="text-text-primary">Try {n} — {info.label}</strong>
                  <span className="ml-1">{info.desc}</span>
                </div>
                <span
                  className="ml-auto text-[11px] font-extrabold px-[10px] py-[3px] rounded-full whitespace-nowrap"
                  style={{ color: info.color, background: info.bgColor }}
                >
                  #{n}
                </span>
              </div>
            )
          })}
        </div>

        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-2.5 w-full py-4 bg-orange text-[#0c0c14]
            border-none rounded-xl font-display text-[24px] tracking-[3px] cursor-pointer
            transition-all duration-200 shadow-[0_4px_18px_rgba(249,115,22,0.35)] outline-none
            hover:bg-[#ff8040] hover:-translate-y-0.5 focus:bg-[#ff8040]"
        >
          LET'S GO
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        <p className="text-center text-[11px] text-text-muted mt-2.5 tracking-[1px] uppercase font-semibold">
          Tap or press any key
        </p>
      </div>
    </div>
  )
}
