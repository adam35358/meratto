/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07080a',
        background2: '#0b0d10',
        foreground: '#eef0f3',
        muted: '#15181d',
        mutedForeground: '#8f96a0',
        subtle: '#5f6671',
        border: 'rgba(255, 255, 255, 0.08)',
        borderStrong: 'rgba(255, 255, 255, 0.16)',
        gold: '#E5C378',
        goldDark: '#C5A059',
        positive: '#4fc79a',
        panel: 'rgba(13, 15, 19, 0.72)',
        panelStrong: 'rgba(17, 19, 24, 0.88)',
        'woufx-muted': '#8f96a0',
        'woufx-subtle': '#5f6671',
        'woufx-gold': '#E5C378',
        'woufx-positive': '#4fc79a',
        'woufx-panel': 'rgba(13, 15, 19, 0.72)',
        'woufx-panel-strong': 'rgba(17, 19, 24, 0.88)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['Outfit', 'serif'] // fallback for existing serif classes to smooth modern Outfit
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(.22, 1, .36, 1)'
      }
    },
  },
  plugins: [],
}
