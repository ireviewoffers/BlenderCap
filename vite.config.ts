import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// For GitHub project pages, CI sets BASE_PATH to /repo-name/ (see deploy workflow).
const base = process.env.BASE_PATH?.trim() || '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
