// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],                // <- REQUIRED for shadcn themes
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
