/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
	darkMode: 'class', 
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
			colors: {
				// ...colors,
				'blue-game': '#01FDFF',
				'blue-app': '#050C2E',
				'gray-A3' : '#A3A3A3',
			},
      fontFamily: {
        'vt323': ['VT323', 'monospace'],
        'press-start': ['Press Start 2P', 'cursive'],
        'Montserrat': ['Montserrat Alternates', 'sans-serif']
      }
    },
  },
  plugins: [],
}
