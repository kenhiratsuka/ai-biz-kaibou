import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#3b82f6',
          500: '#0066ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: '#0066ff',
      },
    },
  },
  plugins: [typography],
}

export default config
