/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0c0c14',
        card: '#13131e',
        'card-border': '#1e1e30',
        'input-bg': '#09090f',
        orange: '#f97316',
        'orange-dim': '#431407',
        amber: '#fbbf24',
        'amber-dim': '#3b2506',
        red: '#ef4444',
        'red-dim': '#3b0f0f',
        magenta: '#d946ef',
        'magenta-dim': '#3b0b45',
        teal: '#2dd4bf',
        'teal-dim': '#0d3d38',
        indigo: '#6366f1',
        'indigo-dim': '#1e1b4b',
        lime: '#84cc16',
        'lime-dim': '#1a2e05',
        'text-primary': '#eeeef8',
        'text-secondary': '#8080aa',
        'text-muted': '#404065',
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
