import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const nm = (pkg: string) => {
  const p = path.resolve(__dirname, `node_modules/${pkg}`)
  return fs.existsSync(p) ? p : pkg
}

export default defineConfig(({ command }) => ({
  // Build-only base: dev serves at '/', the combined Netlify build nests this
  // app under /sections/ in the shared publish dir.
  base: command === 'build' ? '/sections/' : '/',
  server: { port: 5174 },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ],
  publicDir: path.resolve(__dirname, '../_public_'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, '../components'),
      'lucide-react':   nm('lucide-react'),
      'clsx':           nm('clsx'),
      'tailwind-merge': nm('tailwind-merge'),
    },
  },
}))
