import { CONFIG } from '../config'
import { useHighscores } from '../hooks/useHighscores'

interface Props {
  selectedLevel: number
  onSelectLevel: (l: number) => void
  onStart: () => void
}

export default function StartScreen({ selectedLevel, onSelectLevel, onStart }: Props) {
  const { highscores } = useHighscores()
  const hsEntries = Object.entries(highscores)
  const names: Record<string, string> = { lvl1: '1–99', lvl2: '100–999', lvl3: '1000–9999' }

  return (
    <div className="animate-fadeUp">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-[58px] h-[58px] sm:w-[72px] sm:h-[72px] bg-card border border-card-border rounded-[20px] text-amber mb-3 sm:mb-3.5 animate-bounceIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <h1 className="font-display text-[46px] sm:text-[64px] tracking-[3px] sm:tracking-[6px] leading-none text-text-primary">
          DIGIT <span className="text-amber">HUNT</span>
        </h1>
        <p className="mt-2.5 text-[14px] text-text-secondary leading-relaxed">
          Guess the hidden number — too high or too low points the way.<br />10 tries, 8 seconds each.
        </p>
      </div>

      {/* Highscore Banner */}
      {hsEntries.length > 0 && (
        <div className="flex items-center justify-center gap-2 bg-card border border-amber-dim rounded-[10px] px-4 py-[10px] mb-3 text-[13px] font-bold text-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>
            Best:{' '}
            {hsEntries.map(([k, v]) => `${names[k] ?? k}: try ${v}`).join(' · ')}
          </span>
        </div>
      )}

      {/* Level Selection */}
      <div className="bg-card rounded-2xl p-[22px] border border-card-border shadow-[0_4px_32px_rgba(0,0,0,0.4)] mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[2px] uppercase text-text-secondary mb-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Choose your difficulty
        </div>
        <div className="flex flex-col gap-2">
          {CONFIG.levels.map(lvl => (
            <button
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`flex items-center justify-between px-4 py-[14px] border-[1.5px] rounded-xl
                bg-input-bg cursor-pointer transition-all duration-200 text-left w-full outline-none
                hover:border-orange hover:bg-orange-dim hover:translate-x-[3px]
                focus:border-orange focus:bg-orange-dim
                ${selectedLevel === lvl.id ? 'border-amber bg-amber-dim' : 'border-card-border'}
              `}
            >
              <div>
                <div className="text-[15px] font-extrabold text-text-primary">{lvl.name}</div>
                <div className="text-[12px] text-text-secondary mt-0.5">
                  {lvl.digits}-digit numbers · {lvl.min} to {lvl.max}
                </div>
              </div>
              <span className="font-display text-[18px] sm:text-[22px] text-amber shrink-0">
                {lvl.id === 1 ? '1–99' : lvl.id === 2 ? '100–999' : '1000–9999'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phases - compact strip */}
      <div className="flex gap-1.5 mb-3">
        {[
          { num: '1–3', label: 'Normal', c: '#fbbf24' },
          { num: '4–7', label: 'Chaos', c: '#f97316' },
          { num: '8–10', label: 'Normal', c: '#fbbf24' },
        ].map(({ num, label, c }) => (
          <div key={num} className="flex-1 flex flex-col items-center py-2.5 bg-card rounded-xl border border-card-border">
            <span className="font-display text-[17px] leading-none" style={{ color: c }}>{num}</span>
            <span className="text-[9px] text-text-muted font-bold tracking-wide mt-1 uppercase">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-text-muted mb-3 tracking-wide">
        Tries 4–7 use <strong className="text-text-secondary">random chaos modes</strong> — different every game.
      </p>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="flex items-center justify-center gap-2.5 w-full py-[18px] bg-orange text-[#0c0c14]
          border-none rounded-[14px] font-display text-[26px] tracking-[4px] cursor-pointer
          transition-all duration-200 shadow-[0_4px_20px_rgba(249,115,22,0.4)] outline-none
          hover:bg-[#ff8040] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(249,115,22,0.5)]
          focus:bg-[#ff8040]"
      >
        START GAME
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </button>
    </div>
  )
}
