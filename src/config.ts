import { GameMode } from './types'

export const CONFIG = {
  maxAttempts: 10,
  timerSeconds: 8,
  levels: [
    { id: 1, name: 'Level 1', min: 1,    max: 99,   digits: 2 },
    { id: 2, name: 'Level 2', min: 100,  max: 999,  digits: 3 },
    { id: 3, name: 'Level 3', min: 1000, max: 9999, digits: 4 },
  ],
  chaosModes: ['slot', 'choice', 'brain', 'range', 'mirror', 'quiz'] as GameMode[],
  modeIntroTimes: {
    normal: 0,
    slot:   10,
    choice: 10,
    range:  12,
    mirror: 12,
    brain:  15,
    quiz:   12,
  } as Record<GameMode, number>,
  quips: {
    low:     ['Too low.', 'Go higher.', 'Not even close — up!', 'Think bigger.', 'Way below.'],
    high:    ['Too high.', 'Come down.', 'Overshot it.', 'Too much.', 'Rein it in.'],
    timeout: ['Too slow.', 'Tick tock — gone.', '8 seconds not enough?', 'Hesitate and lose.', "Time's up."],
    win:     ['Got it.', 'Pure instinct.', 'Nailed it.', 'Unstoppable.', 'Brilliant.'],
    lose:    ['Next time.', 'The number wins today.', 'So close.', "Don't panic.", 'Try again.'],
  },
} as const
