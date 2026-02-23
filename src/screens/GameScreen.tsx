import { GameMode, DotState, FeedbackType } from '../types'
import { CONFIG } from '../config'
import AttemptDots from '../components/AttemptDots'
import TimerBar from '../components/TimerBar'
import FeedbackBox from '../components/FeedbackBox'
import NormalZone from '../components/zones/NormalZone'
import SlotZone from '../components/zones/SlotZone'
import ChoiceZone from '../components/zones/ChoiceZone'
import BrainZone from '../components/zones/BrainZone'
import RangeZone from '../components/zones/RangeZone'
import MirrorZone from '../components/zones/MirrorZone'
import QuizZone from '../components/zones/QuizZone'

interface Props {
  attempt: number
  dotStates: DotState[]
  currentMode: GameMode
  modeMap: Record<number, GameMode>
  timerLeft: number
  typedValue: string
  feedbackType: FeedbackType
  feedbackText: string
  feedbackVisible: boolean
  selectedLevel: number
  secretNumber: number
  choiceOptions: number[]
  equation: string
  quizQuestion: string
  slotNumber: number | null
  slotSpinning: boolean
  slotDone: boolean
  onTyped: (val: string) => void
  onSpin: () => void
  onChoicePick: (val: number) => void
  resultState: 'correct' | 'wrong' | null
}

const modeLabels: Record<GameMode, string> = {
  normal: 'Guess',
  slot:   'Slot Machine',
  choice: '1 of 10',
  brain:  'Brain Mode',
  range:  'Range Hint',
  mirror: 'Mirror',
  quiz:   'Quiz',
}

const badgeClasses: Record<GameMode, string> = {
  normal: 'bg-[rgba(251,191,36,0.12)] border-amber-dim text-amber',
  slot:   'bg-[rgba(249,115,22,0.12)] border-orange-dim text-orange',
  choice: 'bg-[rgba(217,70,239,0.12)] border-magenta-dim text-magenta',
  brain:  'bg-[rgba(45,212,191,0.12)] border-teal-dim text-teal',
  range:  'bg-[rgba(251,191,36,0.12)] border-amber-dim text-amber',
  mirror: 'bg-[rgba(99,102,241,0.12)] border-indigo-dim text-indigo',
  quiz:   'bg-[rgba(132,204,22,0.12)] border-lime-dim text-lime',
}

const cardBorderClasses: Record<GameMode, string> = {
  normal: 'border-card-border',
  slot:   'border-orange-dim',
  choice: 'border-magenta-dim',
  brain:  'border-teal-dim',
  range:  'border-amber-dim',
  mirror: 'border-indigo-dim',
  quiz:   'border-lime-dim',
}

const cardTopBarClasses: Record<GameMode, string> = {
  normal: 'bg-amber',
  slot:   'bg-orange',
  choice: 'bg-magenta',
  brain:  'bg-teal',
  range:  'bg-amber',
  mirror: 'bg-indigo',
  quiz:   'bg-lime',
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
  if (mode === 'range') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/>
    </svg>
  )
  if (mode === 'mirror') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18"/>
    </svg>
  )
  if (mode === 'quiz') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18h6"/><path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
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
  if (mode === 'normal') return <><strong>Type the number</strong> — auto-submit after {digits} digits.</>
  if (mode === 'slot') return <><strong>Press the button</strong> to spin the wheel.</>
  if (mode === 'choice') return <><strong>Pick a number</strong> — tap it directly.</>
  if (mode === 'range') return <><strong>A range is shown</strong> — type the exact number inside it.</>
  if (mode === 'mirror') return <><strong>Digits are reversed</strong> — figure out the real number.</>
  if (mode === 'quiz') return <><strong>Read the question</strong> and type the number that answers it.</>
  return <><strong>Solve the equation</strong> and type the result.</>
}

export default function GameScreen({
  attempt, dotStates, currentMode, modeMap, timerLeft,
  typedValue, feedbackType, feedbackText, feedbackVisible,
  selectedLevel, secretNumber, choiceOptions, equation, quizQuestion,
  slotNumber, slotSpinning, slotDone,
  onTyped, onSpin, onChoicePick, resultState,
}: Props) {
  const lvl = CONFIG.levels.find(x => x.id === selectedLevel)!
  const choiceDone = resultState !== null

  return (
    <div className="animate-fadeUp">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 mb-4">
        <AttemptDots dotStates={dotStates} attempt={attempt} modeMap={modeMap} />
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
        {currentMode === 'range' && (
          <RangeZone
            key={attempt}
            secret={secretNumber}
            digits={lvl.digits}
            levelMin={lvl.min}
            levelMax={lvl.max}
            value={typedValue}
            resultState={resultState}
            onInput={onTyped}
          />
        )}
        {currentMode === 'mirror' && (
          <MirrorZone
            key={attempt}
            secret={secretNumber}
            digits={lvl.digits}
            value={typedValue}
            resultState={resultState}
            onInput={onTyped}
          />
        )}
        {currentMode === 'quiz' && (
          <QuizZone
            key={attempt}
            question={quizQuestion}
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
