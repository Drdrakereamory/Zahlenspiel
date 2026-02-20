/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a0a0a',
        card: '#2a1010',
        'card-border': '#401a1a',
        'input-bg': '#100606',
        orange: '#f07030',
        'orange-dim': '#7a2e08',
        amber: '#f5c518',
        'amber-dim': '#7a6008',
        red: '#e04030',
        'red-dim': '#6a1a10',
        magenta: '#c040e0',
        'magenta-dim': '#5a1068',
        teal: '#20b09a',
        'teal-dim': '#0a5048',
        'text-primary': '#fff5e8',
        'text-secondary': '#e0b890',
        'text-muted': '#a07050',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '65%': { transform: 'scale(1.08)' },
          '85%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-9px)' },
          '40%': { transform: 'translateX(9px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        pulseAnim: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        timerPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        feedbackPop: {
          '0%': { transform: 'scale(0.94)' },
          '55%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        digitPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0.4' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease',
        bounceIn: 'bounceIn 0.5s ease',
        shake: 'shake 0.4s ease',
        pulseAnim: 'pulseAnim 1s infinite',
        timerPulse: 'timerPulse 0.5s infinite',
        feedbackPop: 'feedbackPop 0.3s ease',
        digitPop: 'digitPop 0.2s ease',
      },
    },
  },
  plugins: [],
}
