/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Custom colors for your financial application
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#4338ca',    // indigo-700
        },
        secondary: {
          DEFAULT: '#0ea5e9', // sky-500
          dark: '#0284c7',    // sky-600
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',    // emerald-600
        },
        warning: {
          DEFAULT: '#f59e0b', // amber-500
          dark: '#d97706',    // amber-600
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          dark: '#dc2626',    // red-600
        },
        dark: {
          DEFAULT: '#1f2937', // gray-800
          light: '#374151',   // gray-700
          deep: '#111827',    // gray-900
        },
      },
    },
  },
  plugins: [],
}