/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flood: {
          dark: '#0B1120',
          card: '#111827',
          border: '#1F2937',
          accent: '#38BDF8',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981'
        }
      }
    },
  },
  plugins: [],
}
