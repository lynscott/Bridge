/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      spacing: {
        'safe': 'env(safe-area-inset-top)',
      },
  		colors: {},
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'wave': 'wave 10s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear'

      },
  	}
  },
  variants: {
    extend: {
      display: ['group-hover', 'group-active']
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar'),
  ],
}

