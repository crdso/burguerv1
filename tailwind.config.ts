import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        /** Page background. Must match --page in index.css and PAGE in scripts/encode-scrub-video.mjs. */
        paper: '#FCFAF8',
        surface: '#FFFFFF',
        ink: '#161616',
        graphite: '#353535',
        line: '#E5E2DF',
        void: '#080706',
        charcoal: '#11100E',
        flame: '#D92D15',
        ember: '#FF5A1F',
        cream: '#F2E6D2',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['Archivo', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.24em',
      },
    },
  },
  plugins: [],
} satisfies Config
