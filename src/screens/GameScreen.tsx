import { GameMode, DotState, FeedbackType } from '../types'
import { CONFIG } from '../config'
import AttemptDots from '../components/AttemptDots'
import TimerBar from '../components/TimerBar'
import FeedbackBox from '../components/FeedbackBox'
import NormalZone from '../components/zones/NormalZone'
import SlotZone from '../components/zones/SlotZone'
import ChoiceZone from '../components/zones/ChoiceZone'
import BrainZone from '../components/zones/BrainZone'

interface Props {
  attempt: number
  dotStates: DotState[]
  currentMode: GameMode
  timerLeft: number
  typedValue: string
  feedbackType: FeedbackType
  feedbackText: string
  feedbackVisible: boolean
  selectedLevel: number
  secretNumber: number
  choiceOptions: number[]
  equation: string
  slotNumber: number | null
  slotSpinning: boolean
  slotDone: boolean
  onTyped: (val: string) => void
  onSpin: () => void
  onChoicePick: (val: number) => void
  resultState: 'correct' | 'wrong' | null
}

const modeLabels: Record<GameMode, string> = {
  normal: 'Normales Raten',
  slot: 'Slot Mode',
  choice: '1 aus 10',
  brain: 'Brain Mode',
}

const badgeClasses: Record<GameMode, string> = {
  normal:  'bg-[rgba(245,197,24,0.12)] border-amber-dim text-amber',
  slot:    'bg-[rgba(240,112,48,0.12)] border-orange-dim text-orange',
  choice:  'bg-[rgba(192,64,224,0.12)] border-magenta-dim text-magenta',
  brain:   'bg-[rgba(32,176,154,0.12)] border-teal-dim text-teal',
}

const cardBorderClasses: Record<GameMode, string> = {
  normal:  'border-card-border',
  slot:    'border-orange-dim',
  choice:  'border-magenta-dim',
  brain:   'border-teal-dim',
}

const cardTopBarClasses: Record<GameMode, string> = {
  normal: 'bg-amber',
  slot:   'bg-orange',
  choice: 'bg-magenta',
  brain:  'bg-teal',
}

function BadgeIcon({ mode }: { mode: GameMode }) {
  if (mode === 'normal') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
  if (mode === 'slot') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
    </svg>
  )
  if (mode === 'choice') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/>
    </svg>
  )
}

function getInstruction(mode: GameMode, digits: number): React.ReactNode {
  if (mode === 'normal') return <><strong>Tippe die Zahl ein</strong> — automatische Auswertung nach {digits} Ziffern.</>
  if (mode === 'slot') return <><strong>Drücke den Knopf</strong> um das Rad zu drehen.</>
  if (mode === 'choice') return <><strong>Wähle eine Zahl</strong> — tippe direkt darauf.</>
  return <><strong>Löse die Gleichung</strong> und tippe das Ergebnis ein — automatische Auswertung.</>
}

export default function GameScreen({
  attempt, dotStates, currentMode, timerLeft,
  typedValue, feedbackType, feedbackText, feedbackVisible,
  selectedLevel, secretNumber, choiceOptions, equation,
  slotNumber, slotSpinning, slotDone,
  onTyped, onSpin, onChoicePick, resultState,
}: Props) {
  const lvl = CONFIG.levels.find(x => x.id === selectedLevel)!
  const choiceDone = resultState !== null

  return (
    <div className="animate-fadeUp">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 mb-4">
        <AttemptDots dotStates={dotStates} attempt={attempt} />
        <div className="font-display text-[20px] text-text-secondary whitespace-nowrap">
          {attempt}/{CONFIG.maxAttempts}
        </div>
      </div>

      {/* Phase badge */}
      <div className="text-center mb-3">
        <div className={`inline-flex items-center gap-1.5 px-4 py-[5px] rounded-full text-[11px] font-extrabold tracking-[1.5px] uppercase border transition-all duration-300 ${badgeClasses[currentMode]}`}>
          <BadgeIcon mode={currentMode} />
          {modeLabels[currentMode]}
        </div>
      </div>

      {/* Game Card */}
      <div className={`bg-card rounded-2xl border overflow-hidden mb-3 transition-colors duration-300 shadow-[0_4px_32px_rgba(0,0,0,0.4)] ${cardBorderClasses[currentMode]}`}>
        {/* Top color bar */}
        <div className={`h-[3px] transition-colors duration-300 ${cardTopBarClasses[currentMode]}`} />

        <div className="px-5 pt-[18px] pb-0">
          <div className="text-[14px] font-semibold text-text-secondary mb-3.5 leading-relaxed min-h-[42px]">
            {getInstruction(currentMode, lvl.digits)}
          </div>
          <TimerBar timerLeft={timerLeft} />
        </div>

        {currentMode === 'normal' && (
          <NormalZone
            key={attempt}
            digits={lvl.digits}
            value={typedValue}
            resultState={resultState}
            onInput={onTyped}
          />
        )}
        {currentMode === 'slot' && (
          <SlotZone
            slotNumber={slotNumber}
            slotSpinning={slotSpinning}
            slotDone={slotDone}
            onSpin={onSpin}
          />
        )}
        {currentMode === 'choice' && (
          <ChoiceZone
            key={attempt}
            options={choiceOptions}
            secret={secretNumber}
            onPick={onChoicePick}
            done={choiceDone}
          />
        )}
        {currentMode === 'brain' && (
          <BrainZone
            key={attempt}
            equation={equation}
            digits={lvl.digits}
            value={typedValue}
            resultState={resultState}
            onInput={onTyped}
          />
        )}
      </div>

      {/* Feedback */}
      <FeedbackBox type={feedbackType} text={feedbackText} visible={feedbackVisible} />
    </div>
  )
}
