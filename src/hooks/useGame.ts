import { useReducer, useEffect, useRef, useCallback } from 'react'
import { CONFIG } from '../config'
import { GameState, GameAction, DotState, GameMode, FeedbackType } from '../types'
import { useSound } from './useSound'
import { useHighscores } from './useHighscores'

const rnd = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function buildChoiceOptions(levelId: number, secret: number): number[] {
  const lvl = CONFIG.levels.find(x => x.id === levelId)!
  const opts = new Set<number>([secret])
  while (opts.size < 10) opts.add(randBetween(lvl.min, lvl.max))
  return [...opts].sort(() => Math.random() - 0.5)
}

function buildEquation(secret: number): string {
  if (Math.random() < 0.5) {
    const a = randBetween(1, secret - 1)
    return `${a} + ${secret - a} = ?`
  }
  const divisors: number[] = []
  for (let i = 2; i <= Math.sqrt(secret); i++) {
    if (secret % i === 0) divisors.push(i)
  }
  if (divisors.length > 0) {
    const a = divisors[Math.floor(Math.random() * divisors.length)]
    return `${a} × ${secret / a} = ?`
  }
  const a = randBetween(1, secret - 1)
  return `${a} + ${secret - a} = ?`
}

function getInitialState(): GameState {
  return {
    screen: 'start',
    selectedLevel: 1,
    secretNumber: 0,
    attempt: 0,
    dotStates: Array(CONFIG.maxAttempts).fill('pending') as DotState[],
    currentMode: 'normal',
    timerLeft: CONFIG.timerSeconds,
    timerRunning: false,
    typedValue: '',
    feedbackType: 'info',
    feedbackText: 'Viel Glück — die Zahl wartet auf dich.',
    feedbackVisible: true,
    transitionShown: false,
    choiceOptions: [],
    equation: '',
    slotNumber: null,
    slotSpinning: false,
    slotDone: false,
    won: false,
    isNewHighscore: false,
  }
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_LEVEL':
      return { ...state, selectedLevel: action.level }

    case 'START_GAME': {
      const lvl = CONFIG.levels.find(x => x.id === state.selectedLevel)!
      const secret = randBetween(lvl.min, lvl.max)
      const mode = CONFIG.modeMap[1] as GameMode
      return {
        ...getInitialState(),
        selectedLevel: state.selectedLevel,
        secretNumber: secret,
        screen: 'game',
        attempt: 1,
        dotStates: Array(CONFIG.maxAttempts).fill('pending') as DotState[],
        currentMode: mode,
        timerLeft: CONFIG.timerSeconds,
        timerRunning: true,
        feedbackText: 'Die Zahl wartet auf dich.',
        feedbackVisible: true,
        choiceOptions: mode === 'choice' ? buildChoiceOptions(state.selectedLevel, secret) : [],
        equation: mode === 'brain' ? buildEquation(secret) : '',
      }
    }

    // Show transition screen — increment attempt to 4 so slot mode loads correctly
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
      const mode = CONFIG.modeMap[state.attempt] as GameMode
      return {
        ...state,
        screen: 'game',
        timerRunning: true,
        timerLeft: CONFIG.timerSeconds,
        currentMode: mode,
        typedValue: '',
        feedbackText: 'Die Zahl wartet auf dich.',
        feedbackVisible: true,
        feedbackType: 'info',
        slotNumber: null,
        slotSpinning: false,
        slotDone: false,
        choiceOptions: mode === 'choice' ? buildChoiceOptions(state.selectedLevel, state.secretNumber) : [],
        equation: mode === 'brain' ? buildEquation(state.secretNumber) : '',
      }
    }

    case 'SET_TYPED':
      return { ...state, typedValue: action.value }

    case 'PAUSE_TIMER':
      return { ...state, timerRunning: false }

    case 'NEXT_ATTEMPT': {
      const nextAttempt = state.attempt + 1
      const mode = CONFIG.modeMap[nextAttempt] as GameMode
      return {
        ...state,
        attempt: nextAttempt,
        typedValue: '',
        timerLeft: CONFIG.timerSeconds,
        timerRunning: true,
        currentMode: mode,
        feedbackText: 'Die Zahl wartet auf dich.',
        feedbackVisible: true,
        feedbackType: 'info',
        slotNumber: null,
        slotSpinning: false,
        slotDone: false,
        choiceOptions: mode === 'choice' ? (action.choiceOptions ?? buildChoiceOptions(state.selectedLevel, state.secretNumber)) : [],
        equation: mode === 'brain' ? (action.equation ?? buildEquation(state.secretNumber)) : '',
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
  // Track whether a timeout has been dispatched to prevent double-dispatch
  const timeoutFiredRef = useRef(false)

  // Timer interval
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

  // Timer side-effects: tick sound + timeout detection
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
          // Attempt 4 triggers the transition screen (increment happens inside SHOW_TRANSITION)
          if (nextAttempt === 4 && !state.transitionShown) {
            dispatch({ type: 'SHOW_TRANSITION' })
          } else {
            const mode = CONFIG.modeMap[nextAttempt] as GameMode
            dispatch({
              type: 'NEXT_ATTEMPT',
              choiceOptions: mode === 'choice' ? buildChoiceOptions(state.selectedLevel, state.secretNumber) : undefined,
              equation: mode === 'brain' ? buildEquation(state.secretNumber) : undefined,
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
  }, [state.dotStates, state.attempt, state.timerRunning, state.screen, state.transitionShown, state.selectedLevel, state.secretNumber, saveHighscore])

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
      // Stop timer immediately, then process guess after short delay
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
    processGuess,
    handleTyped,
    spinSlot,
    choicePick,
    goToStart,
    getHighscore,
  }
}
