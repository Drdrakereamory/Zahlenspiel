export const CONFIG = {
  maxAttempts: 10,
  timerSeconds: 5,
  levels: [
    { id: 1, name: 'Warm-up',      min: 1,    max: 99,   digits: 2 },
    { id: 2, name: 'Serious Mode', min: 100,  max: 999,  digits: 3 },
    { id: 3, name: 'No Mercy',     min: 1000, max: 9999, digits: 4 },
  ],
  modeMap: {
    1: 'normal', 2: 'normal', 3: 'normal',
    4: 'slot',   5: 'choice', 6: 'brain',
    7: 'normal', 8: 'normal', 9: 'normal', 10: 'normal',
  } as Record<number, string>,
  quips: {
    low:     ['Zu niedrig.', 'Kalt — sehr kalt.', 'Höher denken.', 'Da unten liegt nichts.', 'Mehr Mut.'],
    high:    ['Zu hoch.', 'Runter kommen.', 'Überschätzt.', 'Deutlich zu viel.', 'Etwas bescheidener.'],
    timeout: ['Zu langsam.', 'Tick tack — weg.', '5 Sekunden reichen.', 'Wer zögert verliert.', 'Zeit ist raus.'],
    win:     ['Gewusst wie.', 'Reiner Instinkt.', 'Lucky Strike.', 'Nicht aufzuhalten.', 'Klasse.'],
    lose:    ['Nächstes Mal.', 'Die Zahl gewinnt heute.', 'War knapp.', 'Kein Grund zur Panik.', 'Versuch\'s nochmal.'],
  },
} as const
