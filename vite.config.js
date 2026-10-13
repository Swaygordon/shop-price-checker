import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // gh-pages serves the site from /shop-price-checker/; dev stays at /.
  base: process.env.VERCEL ? '/' : '/shop-price-checker/',
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
