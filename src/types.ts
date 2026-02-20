export type GameMode = 'normal' | 'slot' | 'choice' | 'brain'
export type Screen = 'start' | 'transition' | 'game' | 'end'
export type DotState = 'pending' | 'correct' | 'wrong' | 'timeout'
export type FeedbackType = 'info' | 'low' | 'high' | 'win' | 'lose' | 'timeout'

export interface Level {
  id: number
  name: string
  min: number
  max: number
  digits: number
}

export interface GameState {
  screen: Screen
  selectedLevel: number
  secretNumber: number
  attempt: number
  dotStates: DotState[]
  currentMode: GameMode
  timerLeft: number
  timerRunning: boolean
  typedValue: string
  feedbackType: FeedbackType
  feedbackText: string
  feedbackVisible: boolean
  transitionShown: boolean
  choiceOptions: number[]
  equation: string
  slotNumber: number | null
  slotSpinning: boolean
  slotDone: boolean
  // end screen
  won: boolean
  isNewHighscore: boolean
}

export type GameAction =
  | { type: 'SELECT_LEVEL'; level: number }
  | { type: 'START_GAME' }
  | { type: 'CONTINUE_FROM_TRANSITION' }
  | { type: 'SET_TYPED'; value: string }
  | { type: 'PROCESS_GUESS'; val: number }
  | { type: 'TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'SPIN_START'; options: number[] }
  | { type: 'SLOT_TICK'; display: number }
  | { type: 'SLOT_RESULT'; result: number }
  | { type: 'CHOICE_PICK'; val: number }
  | { type: 'GO_TO_START' }
  | { type: 'SET_FEEDBACK'; feedbackType: FeedbackType; feedbackText: string }
  | { type: 'NEXT_ATTEMPT'; choiceOptions?: number[]; equation?: string }
  | { type: 'END_GAME'; won: boolean; isNewHighscore: boolean }
  | { type: 'SHOW_TRANSITION' }
  | { type: 'PAUSE_TIMER' }
