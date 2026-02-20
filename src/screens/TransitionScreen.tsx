interface Props {
  onContinue: () => void
}

export default function TransitionScreen({ onContinue }: Props) {
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

        <div className="font-display text-[34px] sm:text-[44px] tracking-[2px] sm:tracking-[3px] text-amber mb-2.5">AB JETZT: CHAOS</div>
        <div className="text-[14px] text-text-secondary leading-[1.7] mb-[22px]">
          Die nächsten 3 Versuche gehören nicht mehr dir allein. Der Algorithmus mischt mit.
        </div>

        <div className="flex flex-col gap-[9px] mb-[22px] text-left">
          {/* Slot */}
          <div className="flex items-center gap-3 px-[14px] py-3 rounded-[10px] border bg-[rgba(240,112,48,0.15)] border-orange-dim">
            <div className="shrink-0 text-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 12h10M12 7v10"/>
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-text-secondary">
              <strong className="text-text-primary">V4 — Slot Mode</strong> Dreh das Rad. Kein Einfluss.
            </div>
            <span className="ml-auto text-[11px] font-extrabold px-[10px] py-[3px] rounded-full whitespace-nowrap bg-orange-dim text-orange">V4</span>
          </div>

          {/* Choice */}
          <div className="flex items-center gap-3 px-[14px] py-3 rounded-[10px] border bg-[rgba(192,64,224,0.15)] border-magenta-dim">
            <div className="shrink-0 text-magenta">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-text-secondary">
              <strong className="text-text-primary">V5 — 1 aus 10</strong> Zehn Zahlen. Wähle richtig.
            </div>
            <span className="ml-auto text-[11px] font-extrabold px-[10px] py-[3px] rounded-full whitespace-nowrap bg-magenta-dim text-magenta">V5</span>
          </div>

          {/* Brain */}
          <div className="flex items-center gap-3 px-[14px] py-3 rounded-[10px] border bg-[rgba(32,176,154,0.15)] border-teal-dim">
            <div className="shrink-0 text-teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
              </svg>
            </div>
            <div className="text-[13px] font-semibold text-text-secondary">
              <strong className="text-text-primary">V6 — Brain Mode</strong> Löse die Gleichung schnell.
            </div>
            <span className="ml-auto text-[11px] font-extrabold px-[10px] py-[3px] rounded-full whitespace-nowrap bg-teal-dim text-teal">V6</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-2.5 w-full py-4 bg-orange text-[#1a0800]
            border-none rounded-xl font-display text-[24px] tracking-[3px] cursor-pointer
            transition-all duration-200 shadow-[0_4px_18px_rgba(240,112,48,0.35)] outline-none
            hover:bg-[#ff8040] hover:-translate-y-0.5 focus:bg-[#ff8040]"
        >
          LOS GEHT'S
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        <p className="text-center text-[11px] text-text-muted mt-2.5 tracking-[1px] uppercase font-semibold">
          Antippen oder Taste drücken
        </p>
      </div>
    </div>
  )
}
