import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // relative stier, så appen virker under /<repo>/ på GitHub Pages
  plugins: [react()],
  server: { port: 5173 },
})
