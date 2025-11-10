/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#7C3AED',
          500: '#A78BFA'
        },
        green: {
          500: '#10B981'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        yellow: {
          500: '#F59E0B'
        },
        red: {
          500: '#EF4444'
        },
        blue: {
          500: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      spacing: {
        18: '4.5rem',
        88: '22rem'
      }
    },
  },
  plugins: [],
}