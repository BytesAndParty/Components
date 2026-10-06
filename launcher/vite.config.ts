import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// The launcher is the deploy root ('/'). The three showcases live under
// subpaths in the combined Netlify publish dir, so base stays '/' here.
export default defineConfig({
  server: { port: 5170 },
  plugins: [
    // React Compiler: plugin-react v6 has no `babel` option anymore — the
    // compiler runs through @rolldown/plugin-babel with the official preset.
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  publicDir: path.resolve(import.meta.dirname, '../_public_'),
})
