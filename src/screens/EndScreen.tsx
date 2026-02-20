interface Props {
  won: boolean
  attempt: number
  secretNumber: number
  isNewHighscore: boolean
  highscore: number | null
  onReplay: () => void
}

export default function EndScreen({ won, attempt, secretNumber, isNewHighscore, highscore, onReplay }: Props) {
  return (
    <div className="text-center animate-fadeUp">
      <div className="bg-card rounded-2xl px-7 py-10 border border-card-border shadow-[0_4px_32px_rgba(0,0,0,0.4)]">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border-2 animate-bounceIn
          ${won ? 'border-amber text-amber bg-[rgba(245,197,24,0.1)]' : 'border-red text-red bg-[rgba(224,64,48,0.1)]'}`}>
          {won ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <div className={`font-display text-[40px] sm:text-[52px] tracking-[2px] sm:tracking-[3px] mb-2 ${won ? 'text-amber' : 'text-red'}`}>
          {won ? 'GEWONNEN' : 'GAME OVER'}
        </div>

        {/* Sub */}
        <div className="text-[15px] text-text-secondary leading-[1.7] mb-[22px]">
          {won
            ? `${secretNumber} in Versuch ${attempt} gefunden${isNewHighscore ? ' — neuer Rekord!' : '.'}`
            : `Die Zahl war ${secretNumber}.`}
        </div>

        {/* Stats */}
        <div className="flex gap-2.5 mb-5">
          {[
            { label: 'Versuch', value: String(attempt) },
            { label: 'Zahl war', value: String(secretNumber) },
            { label: 'Highscore', value: highscore ? `${highscore}V` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 bg-input-bg rounded-xl p-3.5 border border-card-border">
              <div className="text-[10px] font-extrabold tracking-[1px] uppercase text-text-muted mb-1">{label}</div>
              <div className="font-display text-[28px] sm:text-[34px] text-amber">{value}</div>
            </div>
          ))}
        </div>

        {/* Replay */}
        <button
          onClick={onReplay}
          className="flex items-center justify-center gap-2.5 w-full py-4 border-none rounded-xl
            bg-orange text-[#1a0800] font-display text-[24px] tracking-[3px] cursor-pointer
            shadow-[0_4px_18px_rgba(240,112,48,0.35)] transition-all duration-200 outline-none
            hover:bg-[#ff8040] hover:-translate-y-0.5 focus:bg-[#ff8040]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          NOCHMAL SPIELEN
        </button>

        <p className="text-center text-[11px] text-text-muted mt-2.5 tracking-[1px] uppercase font-semibold">
          Antippen oder Taste für eine neue Runde
        </p>
      </div>
    </div>
  )
}
