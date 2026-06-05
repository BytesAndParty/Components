import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// The launcher is the deploy root ('/'). The three showcases live under
// subpaths in the combined Netlify publish dir, so base stays '/' here.
export default defineConfig({
  server: { port: 5170 },
  plugins: [
    react({
      babel: { plugins: ['babel-plugin-react-compiler'] },
    }),
    tailwindcss(),
  ],
  publicDir: path.resolve(__dirname, '../_public_'),
})
