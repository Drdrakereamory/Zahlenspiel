import { useEffect, useState } from 'react'
import { useGame } from './hooks/useGame'
import StartScreen from './screens/StartScreen'
import TransitionScreen from './screens/TransitionScreen'
import ModeIntroScreen from './screens/ModeIntroScreen'
import GameScreen from './screens/GameScreen'
import EndScreen from './screens/EndScreen'

export default function App() {
  const {
    state,
    selectLevel,
    startGame,
    continueFromTransition,
    skipModeIntro,
    handleTyped,
    spinSlot,
    choicePick,
    goToStart,
    getHighscore,
  } = useGame()

  // Track result state for digit display (correct/wrong animation)
  const [resultState, setResultState] = useState<'correct' | 'wrong' | null>(null)

  // Reset result state on new attempt
  useEffect(() => {
    setResultState(null)
  }, [state.attempt, state.currentMode])

  // Derive result state from dotStates
  useEffect(() => {
    const dot = state.dotStates[state.attempt - 1]
    if (dot === 'correct') setResultState('correct')
    else if (dot === 'wrong') setResultState('wrong')
  }, [state.dotStates, state.attempt])

  // Keyboard handling
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { screen, currentMode } = state

      // Mode intro: any key = skip
      if (screen === 'mode-intro') {
        e.preventDefault()
        skipModeIntro()
        return
      }

      // Digit-input modes — let the hidden input handle it
      if (screen === 'game' && (currentMode === 'normal' || currentMode === 'brain' || currentMode === 'quiz' || currentMode === 'range' || currentMode === 'mirror')) {
        if ((e.key >= '0' && e.key <= '9') || e.key === 'Backspace') {
          // handled by hidden input onChange
          return
        }
        // Prevent space from scrolling the page
        if (e.key === ' ') e.preventDefault()
        return
      }

      // Slot: Enter/Space = spin
      if (screen === 'game' && currentMode === 'slot') {
        if ((e.key === 'Enter' || e.key === ' ') && !state.slotSpinning && !state.slotDone) {
          e.preventDefault()
          spinSlot()
        }
        return
      }

      // Start screen
      if (screen === 'start') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          startGame()
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          selectLevel(Math.min(3, state.selectedLevel + 1))
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          selectLevel(Math.max(1, state.selectedLevel - 1))
        }
        return
      }

      // Transition screen: any key = continue
      if (screen === 'transition') {
        e.preventDefault()
        continueFromTransition()
        return
      }

      // End screen: any key = replay
      if (screen === 'end') {
        e.preventDefault()
        goToStart()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state, selectLevel, startGame, continueFromTransition, skipModeIntro, spinSlot, goToStart])

  const hs = getHighscore(state.selectedLevel)

  return (
    <div className="bg-bg min-h-screen flex items-start sm:items-center justify-center px-3 py-5 sm:p-5 font-body text-text-primary relative">
      <div className="w-full max-w-[460px] relative z-[1]">
        {state.screen === 'start' && (
          <StartScreen
            selectedLevel={state.selectedLevel}
            onSelectLevel={selectLevel}
            onStart={startGame}
          />
        )}
        {state.screen === 'transition' && (
          <TransitionScreen onContinue={continueFromTransition} modeMap={state.modeMap} />
        )}
        {state.screen === 'mode-intro' && (
          <ModeIntroScreen
            mode={state.currentMode}
            timeLeft={state.modeIntroTimeLeft}
            onSkip={skipModeIntro}
          />
        )}
        {state.screen === 'game' && (
          <GameScreen
            attempt={state.attempt}
            dotStates={state.dotStates}
            currentMode={state.currentMode}
            modeMap={state.modeMap}
            timerLeft={state.timerLeft}
            typedValue={state.typedValue}
            feedbackType={state.feedbackType}
            feedbackText={state.feedbackText}
            feedbackVisible={state.feedbackVisible}
            selectedLevel={state.selectedLevel}
            secretNumber={state.secretNumber}
            choiceOptions={state.choiceOptions}
            equation={state.equation}
            quizQuestion={state.quizQuestion}
            slotNumber={state.slotNumber}
            slotSpinning={state.slotSpinning}
            slotDone={state.slotDone}
            onTyped={handleTyped}
            onSpin={spinSlot}
            onChoicePick={choicePick}
            resultState={resultState}
          />
        )}
        {state.screen === 'end' && (
          <EndScreen
            won={state.won}
            attempt={state.attempt}
            secretNumber={state.secretNumber}
            isNewHighscore={state.isNewHighscore}
            highscore={hs}
            onReplay={goToStart}
          />
        )}
      </div>
    </div>
  )
}
