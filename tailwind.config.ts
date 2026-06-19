import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#E1BF92',
        cream: '#DFE0E1',
        champagne: '#A8A6A1',
        gold: '#A8A6A1',
        'gold-light': '#A8A6A1',
        warmWhite: '#E1BF92',
        warmBrown: '#38383B',
        darkText: '#38383B',
        lightText: '#A8A6A1',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Cormorant Garamond', 'Garamond', 'serif'],
        body: ['Lato', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #38383B 0%, #A8A6A1 50%, #38383B 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
