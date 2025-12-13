/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a192f', // Keeping specifically for components that might still want it
        black: '#000000', // Pure black for background
        lightNavy: '#112240',
        lightestNavy: '#233554',
        green: '#64ffda',
        slate: '#8892b0',
        lightSlate: '#a8b2d1',
        lightestSlate: '#ccd6f6',
        white: '#ffffff', // Pure white (was #e6f1ff)
        // purple: '#6b46c1', // Removed to restore default Tailwind purple palette (purple-400, purple-600 etc.)
        // Light mode specific colors (Monotone)
        lightBg: '#ffffff', // Pure white
        lightText: '#000000', // Stark black
        lightGray: '#f5f5f5', // Very light gray for subtle backgrounds
        lightBorder: '#e5e5e5', // Light border
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

