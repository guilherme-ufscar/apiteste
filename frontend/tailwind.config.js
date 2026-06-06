/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05101e',
          900: '#07131f',
          800: '#0c1c2e',
          700: '#112540',
          600: '#172e52',
          500: '#1e3a66',
          400: '#274d87',
        },
        azure: {
          DEFAULT: '#3d8bff',
          dark: '#2563eb',
          glow: 'rgba(61,139,255,0.18)',
        },
        aureate: {
          DEFAULT: '#d4a017',
          light: '#e8b84b',
        },
        mist: {
          100: '#dde8f5',
          200: '#b8cce0',
          300: '#8fafc8',
          400: '#6a90ae',
          500: '#4d7291',
          600: '#355870',
        },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        display: ['"Spectral"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(61,139,255,0.2)',
        'glow-sm': '0 0 10px rgba(61,139,255,0.15)',
        card: '0 4px 24px rgba(0,0,0,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
