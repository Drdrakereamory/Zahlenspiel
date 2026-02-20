interface Props {
  slotNumber: number | null
  slotSpinning: boolean
  slotDone: boolean
  onSpin: () => void
}

export default function SlotZone({ slotNumber, slotSpinning, slotDone, onSpin }: Props) {
  const disabled = slotSpinning || slotDone

  return (
    <div className="px-5 pb-5">
      <div
        className="bg-input-bg border border-orange-dim rounded-xl p-7 text-center mb-3 relative overflow-hidden"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(240,112,48,0.03) 0px, transparent 2px, transparent 20px)',
        }}
      >
        <div className="font-display text-[68px] sm:text-[88px] text-amber leading-none">
          {slotNumber ?? '?'}
        </div>
        <div className="text-[12px] tracking-[2px] text-text-secondary uppercase mt-1">
          {slotSpinning ? 'Dreht sich...' : slotDone ? 'Das Schicksal hat gesprochen.' : 'Bereit zum Drehen'}
        </div>
      </div>
      <button
        onClick={onSpin}
        disabled={disabled}
        className="flex items-center justify-center gap-2 w-full py-[14px] bg-orange text-[#1a0800]
          border-none rounded-[10px] font-display text-[20px] tracking-[3px] cursor-pointer
          transition-all duration-200 outline-none
          hover:not-disabled:bg-[#ff8040] hover:not-disabled:scale-[1.02]
          disabled:opacity-35 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        DREHEN
      </button>
    </div>
  )
}
