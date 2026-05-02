import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const nm = (pkg: string) => path.resolve(__dirname, `node_modules/${pkg}`)
const arkui = (name: string) => nm(`@ark-ui/react/dist/components/${name}/index.js`)

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React Compiler — eliminates manual useMemo/useCallback
          ['babel-plugin-react-compiler', { compilationMode: 'all' }],
        ],
      },
    }),
    tailwindcss(),
  ],
  publicDir: path.resolve(__dirname, '../_public_'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, '../components'),

      // @ark-ui/react subpath imports — map directly to dist files to preserve exports map
      '@ark-ui/react/color-picker':   arkui('color-picker'),
      '@ark-ui/react/dialog':         arkui('dialog'),
      '@ark-ui/react/image-cropper':  arkui('image-cropper'),
      '@ark-ui/react/popover':        arkui('popover'),
      '@ark-ui/react/portal':         arkui('portal'),

      // motion (formerly framer-motion) — components import from 'motion/react'
      // Note: no root 'motion' alias — internal motion/dom imports must resolve naturally
      'motion/react':                 nm('motion/react'),
      'framer-motion':                nm('framer-motion'), // kept until all imports migrated

      // All other deps that components use from showcase/node_modules
      'lucide-react':                 nm('lucide-react'),
      'clsx':                         nm('clsx'),
      'tailwind-merge':               nm('tailwind-merge'),
      'zod':                          nm('zod'),
      '@radix-ui/react-dropdown-menu': nm('@radix-ui/react-dropdown-menu'),
      '@number-flow/react':           nm('@number-flow/react'),
      'lottie-react':                 nm('lottie-react'),
      'gsap':                         nm('gsap'),
      'canvas-confetti':              nm('canvas-confetti'),
      '@chenglou/pretext':            nm('@chenglou/pretext'),
      '@tanstack/react-hotkeys':      nm('@tanstack/react-hotkeys'),
      '@tanstack/react-query':        nm('@tanstack/react-query'),
      '@tanstack/react-form':         nm('@tanstack/react-form'),
      '@tanstack/react-table':        nm('@tanstack/react-table'),
    },
  },
})
