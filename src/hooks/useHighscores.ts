import { useState, useCallback } from 'react'

type Highscores = Record<string, number>

const LS_KEY = 'luckyNumberHS'

function load(): Highscores {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function useHighscores() {
  const [highscores, setHighscores] = useState<Highscores>(load)

  const getHighscore = useCallback((levelId: number): number | null => {
    return highscores['lvl' + levelId] ?? null
  }, [highscores])

  const saveHighscore = useCallback((levelId: number, attempts: number): boolean => {
    const hs = load()
    const key = 'lvl' + levelId
    if (!hs[key] || attempts < hs[key]) {
      hs[key] = attempts
      localStorage.setItem(LS_KEY, JSON.stringify(hs))
      setHighscores({ ...hs })
      return true
    }
    return false
  }, [])

  return { highscores, getHighscore, saveHighscore }
}
