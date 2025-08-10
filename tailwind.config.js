/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#E5E7EB',
        text: '#111827',
        background: '#FFFFFF',
        tableRow: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}