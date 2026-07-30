import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds one self-contained .html file — every script, style, image and PDF
// inlined — so it runs straight off the phone with no server and no network.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist',
    // Well above the combined size of the photo and both PDFs, so nothing is
    // emitted as a separate file alongside the HTML.
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
})
