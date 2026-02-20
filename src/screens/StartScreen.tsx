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
  const names: Record<string, string> = { lvl1: '01–99', lvl2: '100–999', lvl3: '1000–9999' }

  return (
    <div className="animate-fadeUp">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-[58px] h-[58px] sm:w-[72px] sm:h-[72px] bg-card border border-card-border rounded-[20px] text-amber mb-3 sm:mb-3.5 animate-bounceIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <h1 className="font-display text-[46px] sm:text-[64px] tracking-[3px] sm:tracking-[6px] leading-none text-text-primary">
          LUCKY <span className="text-amber">NUMBER</span>
        </h1>
        <p className="mt-2.5 text-[14px] italic text-text-secondary leading-relaxed">
          Skill oder Glück? 5 Sekunden pro Versuch.<br />10 Versuche. Ab Versuch 4 übernimmt das Chaos.
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
            Bestmarke:{' '}
            {hsEntries.map(([k, v]) => `${names[k] ?? k}: ${v} V.`).join(' · ')}
          </span>
        </div>
      )}

      {/* Level Selection */}
      <div className="bg-card rounded-2xl p-[22px] border border-card-border shadow-[0_4px_32px_rgba(0,0,0,0.4)] mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[2px] uppercase text-text-secondary mb-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f07030" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Wähle dein Risiko
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
                  {lvl.digits === 2 ? 'Zweistellig' : lvl.digits === 3 ? 'Dreistellig' : 'Vierstellig'} · immer genau {lvl.digits} Ziffern
                </div>
              </div>
              <span className="font-display text-[18px] sm:text-[22px] text-amber shrink-0">
                {lvl.id === 1 ? '01–99' : lvl.id === 2 ? '100–999' : '1000–9999'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="bg-card rounded-2xl p-[22px] border border-card-border shadow-[0_4px_32px_rgba(0,0,0,0.4)] mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[2px] uppercase text-text-secondary mb-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f07030" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Spielphasen
        </div>
        <div className="flex flex-col gap-[7px]">
          {[
            { dot: '#f5c518', text: 'Versuch 1–3', sub: 'Normales Raten. Einfach tippen.', num: '1–3' },
            { dot: '#f07030', text: 'V4 — Slot Mode', sub: 'Das Rad entscheidet.', num: '4' },
            { dot: '#c040e0', text: 'V5 — 1 aus 10', sub: 'Zehn Zahlen. Eine stimmt.', num: '5' },
            { dot: '#20b09a', text: 'V6 — Brain Mode', sub: 'Löse die Gleichung.', num: '6' },
            { dot: '#f5c518', text: 'Versuch 7–10', sub: 'Zurück zum Duell.', num: '7–10' },
          ].map(({ dot, text, sub, num }) => (
            <div key={num} className="flex items-center gap-2.5 px-3 py-[9px] rounded-[9px] bg-input-bg">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
              <span className="text-[13px] text-text-secondary">
                <strong className="text-text-primary font-extrabold">{text}</strong> — {sub}
              </span>
              <span className="ml-auto text-[11px] font-extrabold text-text-muted whitespace-nowrap">{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="flex items-center justify-center gap-2.5 w-full py-[18px] bg-orange text-[#1a0800]
          border-none rounded-[14px] font-display text-[26px] tracking-[4px] cursor-pointer
          transition-all duration-200 shadow-[0_4px_20px_rgba(240,112,48,0.4)] outline-none
          hover:bg-[#ff8040] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(240,112,48,0.5)]
          focus:bg-[#ff8040]"
      >
        SPIEL STARTEN
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </button>
    </div>
  )
}
