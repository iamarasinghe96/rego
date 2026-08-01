import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server only. The shipped file is produced by scripts/build-static.mjs,
// which renders the same components to static HTML with no JavaScript.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
})
