import { useReducer, useEffect, useRef, useCallback } from 'react'
import { CONFIG } from '../config'
import { GameState, GameAction, DotState, GameMode, FeedbackType } from '../types'
import { useSound } from './useSound'
import { useHighscores } from './useHighscores'

const rnd = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function buildModeMap(): Record<number, GameMode> {
  const map: Record<number, GameMode> = {}
  for (let i = 1; i <= CONFIG.maxAttempts; i++) map[i] = 'normal'
  // Pick 5 chaos modes from the full pool (6 modes), assign to attempts 4–8
  const shuffled = [...CONFIG.chaosModes].sort(() => Math.random() - 0.5).slice(0, 5)
  ;[4, 5, 6, 7, 8].forEach((attempt, i) => { map[attempt] = shuffled[i] })
  return map
}

function buildChoiceOptions(levelId: number, secret: number): number[] {
  const lvl = CONFIG.levels.find(x => x.id === levelId)!
  const opts = new Set<number>([secret])
  while (opts.size < 10) opts.add(randBetween(lvl.min, lvl.max))
  return [...opts].sort(() => Math.random() - 0.5)
}

function buildEquation(secret: number): string {
  type EqFn = () => string
  const candidates: EqFn[] = [
    // Addition: a + b = secret
    () => {
      const a = randBetween(1, secret - 1)
      return `${a} + ${secret - a} = ?`
    },
    // Subtraction: (secret + k) − k = secret
    () => {
      const k = randBetween(1, Math.max(1, Math.floor(secret / 3)))
      return `${secret + k} − ${k} = ?`
    },
  ]

  // Multiplication: a × b = secret
  const divisors: number[] = []
  for (let i = 2; i <= Math.sqrt(secret); i++) {
    if (secret % i === 0) divisors.push(i)
  }
  if (divisors.length > 0) {
    candidates.push(() => {
      const a = rnd(divisors)
      return `${a} × ${secret / a} = ?`
    })
  }

  // Division: (secret × k) ÷ k = secret (k = 2–5, product stays readable)
  const divFactors = [2, 3, 4, 5].filter(k => secret * k <= 99999)
  if (divFactors.length > 0) {
    candidates.push(() => {
      const k = rnd(divFactors)
      return `${secret * k} ÷ ${k} = ?`
    })
  }

  // Multi-step: a × b + c = secret (a, b small 2–9; c = remainder ≥ 0)
  const multiPairs: [number, number][] = []
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      if (a * b < secret) multiPairs.push([a, b])
    }
  }
  if (multiPairs.length > 0) {
    candidates.push(() => {
      const [a, b] = rnd(multiPairs)
      const c = secret - a * b
      return `${a} × ${b} + ${c} = ?`
    })
  }

  return rnd(candidates)()
}

function buildWordProblem(secret: number): string {
  type ProblemFn = () => string
  const candidates: ProblemFn[] = []

  // Subtraction: (secret + k) items, remove k
  const k = randBetween(Math.max(1, Math.floor(secret * 0.2)), Math.min(secret - 1, Math.floor(secret * 0.5) + 5))
  candidates.push(() => `A bakery baked ${secret + k} rolls and sold ${k}. How many rolls are left?`)
  candidates.push(() => `A library had ${secret + k} books. ${k} were checked out. How many remain on the shelf?`)

  // Addition: two parts combine
  if (secret >= 2) {
    const a = randBetween(1, secret - 1)
    candidates.push(() => `${a} red marbles and ${secret - a} blue marbles are in a jar. How many marbles total?`)
    candidates.push(() => `A bus picks up ${a} passengers at stop A and ${secret - a} at stop B. How many passengers total?`)
  }

  // Division: secret × k total, split into k equal groups
  const divFactors = [2, 3, 4, 5].filter(k => secret * k <= 9999)
  if (divFactors.length > 0) {
    const dk = rnd(divFactors)
    candidates.push(() => `${secret * dk} medals split equally among ${dk} countries. How many does each country receive?`)
    candidates.push(() => `${secret * dk} candies shared equally among ${dk} kids. How many does each kid get?`)
  }

  // Multiplication: a rows × b items = secret
  const divisors: number[] = []
  for (let i = 2; i <= Math.min(12, Math.sqrt(secret)); i++) {
    if (secret % i === 0) divisors.push(i)
  }
  if (divisors.length > 0) {
    const a = rnd(divisors)
    const b = secret / a
    candidates.push(() => `A field has ${a} rows of ${b} sunflowers each. How many sunflowers in total?`)
    candidates.push(() => `${a} shelves hold ${b} books each. How many books are there in total?`)
  }

  return rnd(candidates)()
}

const defaultModeMap = (): Record<number, GameMode> => {
  const m: Record<number, GameMode> = {}
  for (let i = 1; i <= CONFIG.maxAttempts; i++) m[i] = 'normal'
  return m
}

function getInitialState(): GameState {
  return {
    screen: 'start',
    selectedLevel: 1,
    secretNumber: 0,
    attempt: 0,
    dotStates: Array(CONFIG.maxAttempts).fill('pending') as DotState[],
    currentMode: 'normal',
    modeMap: defaultModeMap(),
    timerLeft: CONFIG.timerSeconds,
    timerRunning: false,
    typedValue: '',
    feedbackType: 'info',
    feedbackText: 'Good luck — the number awaits.',
    feedbackVisible: true,
    transitionShown: false,
    choiceOptions: [],
    equation: '',
    quizQuestion: '',
    slotNumber: null,
    slotSpinning: false,
    slotDone: false,
    modeIntroTimeLeft: 0,
    won: false,
    isNewHighscore: false,
  }
}

function buildModeStart(mode: GameMode, levelId: number, secret: number, choiceOptions?: number[], equation?: string, quizQuestion?: string) {
  return {
    currentMode: mode,
    timerLeft: CONFIG.timerSeconds,
    typedValue: '',
    feedbackText: 'The number awaits.',
    feedbackVisible: true,
    feedbackType: 'info' as FeedbackType,
    slotNumber: null,
    slotSpinning: false,
    slotDone: false,
    choiceOptions: mode === 'choice' ? (choiceOptions ?? buildChoiceOptions(levelId, secret)) : [],
    equation: mode === 'brain' ? (equation ?? buildEquation(secret)) : '',
    quizQuestion: mode === 'quiz' ? (quizQuestion ?? buildWordProblem(secret)) : '',
  }
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_LEVEL':
      return { ...state, selectedLevel: action.level }

    case 'START_GAME': {
      const lvl = CONFIG.levels.find(x => x.id === state.selectedLevel)!
      const secret = randBetween(lvl.min, lvl.max)
      const modeMap = buildModeMap()
      const mode = modeMap[1] as GameMode
      return {
        ...getInitialState(),
        selectedLevel: state.selectedLevel,
        secretNumber: secret,
        screen: 'game',
        attempt: 1,
        dotStates: Array(CONFIG.maxAttempts).fill('pending') as DotState[],
        modeMap,
        timerRunning: true,
        ...buildModeStart(mode, state.selectedLevel, secret),
      }
    }

    case 'SHOW_TRANSITION':
      return {
        ...state,
        screen: 'transition',
        timerRunning: false,
        transitionShown: true,
        attempt: state.attempt + 1,
        typedValue: '',
      }

    case 'CONTINUE_FROM_TRANSITION': {
      const mode = state.modeMap[state.attempt] as GameMode
      const introTime = CONFIG.modeIntroTimes[mode]
      return {
        ...state,
        screen: 'mode-intro',
        timerRunning: false,
        modeIntroTimeLeft: introTime,
        ...buildModeStart(mode, state.selectedLevel, state.secretNumber),
      }
    }

    case 'MODE_INTRO_TICK':
      return { ...state, modeIntroTimeLeft: Math.max(0, state.modeIntroTimeLeft - 0.1) }

    case 'ENTER_GAME_FROM_INTRO': {
      if (state.screen !== 'mode-intro') return state
      return {
        ...state,
        screen: 'game',
        timerRunning: true,
        timerLeft: CONFIG.timerSeconds,
      }
    }

    case 'SET_TYPED':
      return { ...state, typedValue: action.value }

    case 'PAUSE_TIMER':
      return { ...state, timerRunning: false }

    case 'NEXT_ATTEMPT': {
      const nextAttempt = state.attempt + 1
      const mode = state.modeMap[nextAttempt] as GameMode
      const modeBase = buildModeStart(mode, state.selectedLevel, state.secretNumber, action.choiceOptions, action.equation, action.quizQuestion)
      if (mode !== 'normal') {
        // Chaos attempt → show mode intro first
        return {
          ...state,
          attempt: nextAttempt,
          screen: 'mode-intro',
          timerRunning: false,
          modeIntroTimeLeft: CONFIG.modeIntroTimes[mode],
          ...modeBase,
        }
      }
      // Normal attempt → go straight to game
      return {
        ...state,
        attempt: nextAttempt,
        screen: 'game',
        timerRunning: true,
        ...modeBase,
      }
    }

    case 'PROCESS_GUESS': {
      const isCorrect = action.val === state.secretNumber
      const newDotStates = [...state.dotStates] as DotState[]
      newDotStates[state.attempt - 1] = isCorrect ? 'correct' : 'wrong'
      const feedbackType: FeedbackType = isCorrect ? 'win' : (action.val < state.secretNumber ? 'low' : 'high')
      const feedbackText = isCorrect
        ? rnd(CONFIG.quips.win)
        : rnd(action.val < state.secretNumber ? CONFIG.quips.low : CONFIG.quips.high)
      return {
        ...state,
        dotStates: newDotStates,
        timerRunning: false,
        feedbackType,
        feedbackText,
        feedbackVisible: true,
      }
    }

    case 'TIMEOUT': {
      const newDotStates = [...state.dotStates] as DotState[]
      newDotStates[state.attempt - 1] = 'timeout'
      return {
        ...state,
        dotStates: newDotStates,
        timerRunning: false,
        feedbackType: 'timeout',
        feedbackText: rnd(CONFIG.quips.timeout),
        feedbackVisible: true,
      }
    }

    case 'TICK':
      return { ...state, timerLeft: Math.max(0, state.timerLeft - 0.1) }

    case 'SET_FEEDBACK':
      return { ...state, feedbackType: action.feedbackType, feedbackText: action.feedbackText, feedbackVisible: true }

    case 'SPIN_START':
      return { ...state, slotSpinning: true, slotDone: false, timerRunning: false }

    case 'SLOT_TICK':
      return { ...state, slotNumber: action.display }

    case 'SLOT_RESULT':
      return { ...state, slotNumber: action.result, slotSpinning: false, slotDone: true }

    case 'CHOICE_PICK':
      return { ...state, timerRunning: false }

    case 'END_GAME':
      return { ...state, screen: 'end', timerRunning: false, won: action.won, isNewHighscore: action.isNewHighscore }

    case 'GO_TO_START':
      return { ...getInitialState(), screen: 'start' }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)
  const { playSound } = useSound()
  const { getHighscore, saveHighscore } = useHighscores()
  const lastTickRef = useRef(Math.ceil(CONFIG.timerSeconds))
  const slotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingNextRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeoutFiredRef = useRef(false)

  // Game timer interval
  useEffect(() => {
    if (!state.timerRunning) {
      lastTickRef.current = Math.ceil(CONFIG.timerSeconds)
      timeoutFiredRef.current = false
      return
    }
    const id = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 100)
    return () => clearInterval(id)
  }, [state.timerRunning, state.attempt])

  // Game timer side-effects: tick sound + timeout detection
  useEffect(() => {
    if (!state.timerRunning) return

    const curSec = Math.ceil(state.timerLeft)
    if (state.timerLeft <= 3 && curSec !== lastTickRef.current && curSec > 0) {
      playSound('tick')
      lastTickRef.current = curSec
    }

    if (state.timerLeft <= 0 && !timeoutFiredRef.current) {
      timeoutFiredRef.current = true
      dispatch({ type: 'TIMEOUT' })
      playSound('timeout')
    }
  }, [state.timerLeft, state.timerRunning, playSound])

  // Mode intro countdown interval
  useEffect(() => {
    if (state.screen !== 'mode-intro') return
    const id = setInterval(() => {
      dispatch({ type: 'MODE_INTRO_TICK' })
    }, 100)
    return () => clearInterval(id)
  }, [state.screen, state.attempt])

  // Mode intro auto-complete when time runs out
  useEffect(() => {
    if (state.screen !== 'mode-intro') return
    if (state.modeIntroTimeLeft <= 0) {
      dispatch({ type: 'ENTER_GAME_FROM_INTRO' })
    }
  }, [state.modeIntroTimeLeft, state.screen])

  // After a result (correct/wrong/timeout): schedule next action
  useEffect(() => {
    if (pendingNextRef.current) {
      clearTimeout(pendingNextRef.current)
      pendingNextRef.current = null
    }
    if (state.screen !== 'game' || state.timerRunning || state.attempt < 1) return

    const dotState = state.dotStates[state.attempt - 1]
    if (!dotState || dotState === 'pending') return

    if (dotState === 'correct') {
      pendingNextRef.current = setTimeout(() => {
        const isNew = saveHighscore(state.selectedLevel, state.attempt)
        dispatch({ type: 'END_GAME', won: true, isNewHighscore: isNew })
      }, 900)
    } else if (dotState === 'wrong' || dotState === 'timeout') {
      if (state.attempt >= CONFIG.maxAttempts) {
        pendingNextRef.current = setTimeout(() => {
          dispatch({ type: 'END_GAME', won: false, isNewHighscore: false })
        }, 1200)
      } else {
        const delay = dotState === 'timeout' ? 1400 : 1500
        const nextAttempt = state.attempt + 1
        pendingNextRef.current = setTimeout(() => {
          if (nextAttempt === 4 && !state.transitionShown) {
            dispatch({ type: 'SHOW_TRANSITION' })
          } else {
            const mode = state.modeMap[nextAttempt] as GameMode
            dispatch({
              type: 'NEXT_ATTEMPT',
              choiceOptions: mode === 'choice' ? buildChoiceOptions(state.selectedLevel, state.secretNumber) : undefined,
              equation: mode === 'brain' ? buildEquation(state.secretNumber) : undefined,
              quizQuestion: mode === 'quiz' ? buildWordProblem(state.secretNumber) : undefined,
            })
          }
        }, delay)
      }
    }

    return () => {
      if (pendingNextRef.current) {
        clearTimeout(pendingNextRef.current)
        pendingNextRef.current = null
      }
    }
  }, [state.dotStates, state.attempt, state.timerRunning, state.screen, state.transitionShown, state.selectedLevel, state.secretNumber, state.modeMap, saveHighscore])

  const selectLevel = useCallback((level: number) => {
    playSound('nav')
    dispatch({ type: 'SELECT_LEVEL', level })
  }, [playSound])

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' })
  }, [])

  const continueFromTransition = useCallback(() => {
    dispatch({ type: 'CONTINUE_FROM_TRANSITION' })
  }, [])

  const skipModeIntro = useCallback(() => {
    dispatch({ type: 'ENTER_GAME_FROM_INTRO' })
  }, [])

  const processGuess = useCallback((val: number) => {
    const isCorrect = val === state.secretNumber
    playSound(isCorrect ? 'correct' : 'wrong')
    dispatch({ type: 'PROCESS_GUESS', val })
  }, [state.secretNumber, playSound])

  const handleTyped = useCallback((value: string) => {
    const lvl = CONFIG.levels.find(x => x.id === state.selectedLevel)!
    const clean = value.replace(/\D/g, '').slice(0, lvl.digits)
    dispatch({ type: 'SET_TYPED', value: clean })
    if (clean.length > 0) playSound('digit')
    if (clean.length === lvl.digits) {
      dispatch({ type: 'PAUSE_TIMER' })
      const num = parseInt(clean)
      setTimeout(() => processGuess(num), 120)
    }
    return clean
  }, [state.selectedLevel, playSound, processGuess])

  const spinSlot = useCallback(() => {
    if (state.slotSpinning || state.slotDone) return
    const lvl = CONFIG.levels.find(x => x.id === state.selectedLevel)!
    dispatch({ type: 'SPIN_START', options: [] })

    let ticks = 0
    if (slotIntervalRef.current) clearInterval(slotIntervalRef.current)
    slotIntervalRef.current = setInterval(() => {
      const display = randBetween(lvl.min, lvl.max)
      dispatch({ type: 'SLOT_TICK', display })
      playSound('spin')
      ticks++
      if (ticks >= 24) {
        clearInterval(slotIntervalRef.current!)
        slotIntervalRef.current = null
        const result = randBetween(lvl.min, lvl.max)
        dispatch({ type: 'SLOT_RESULT', result })
        setTimeout(() => processGuess(result), 700)
      }
    }, 75)
  }, [state.slotSpinning, state.slotDone, state.selectedLevel, playSound, processGuess])

  const choicePick = useCallback((val: number) => {
    dispatch({ type: 'CHOICE_PICK', val })
    if (val === state.secretNumber) {
      processGuess(val)
    } else {
      setTimeout(() => processGuess(val), 400)
    }
  }, [state.secretNumber, processGuess])

  const goToStart = useCallback(() => {
    dispatch({ type: 'GO_TO_START' })
  }, [])

  return {
    state,
    selectLevel,
    startGame,
    continueFromTransition,
    skipModeIntro,
    processGuess,
    handleTyped,
    spinSlot,
    choicePick,
    goToStart,
    getHighscore,
  }
}
