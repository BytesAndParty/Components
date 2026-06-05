import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const nm = (pkg: string) => {
  const p = path.resolve(__dirname, `node_modules/${pkg}`)
  return fs.existsSync(p) ? p : pkg
}
const arkui = (name: string) => {
  const p = nm(`@ark-ui/react/dist/components/${name}/index.js`)
  return p
}

export default defineConfig(({ command }) => ({
  // Build-only base: dev serves at '/', the combined Netlify build nests this
  // app under /components/ in the shared publish dir. Explicit port ends the
  // 5173 collision with the Vendure storefront.
  base: command === 'build' ? '/components/' : '/',
  server: { port: 5171 },
  plugins: [
    react({
      babel: {
        plugins: [
          // React Compiler — eliminates manual useMemo/useCallback.
          // No compilationMode: default infers correctly (only instruments
          // function components and hooks, not utility functions).
          // 'all' would compile every function incl. module-level utilities,
          // causing useMemoCache calls before React is initialized.
          'babel-plugin-react-compiler',
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

      // All other deps that components use from showcase/node_modules
      'lucide-react':                 nm('lucide-react'),
      'clsx':                         nm('clsx'),
      'tailwind-merge':               nm('tailwind-merge'),
      'zod':                          nm('zod'),
      '@number-flow/react':           nm('@number-flow/react'),
      '@lottiefiles/dotlottie-react': nm('@lottiefiles/dotlottie-react'),
      'canvas-confetti':              nm('canvas-confetti'),
      '@chenglou/pretext':            nm('@chenglou/pretext'),
      '@tanstack/react-hotkeys':      nm('@tanstack/react-hotkeys'),
      '@tanstack/react-query':        nm('@tanstack/react-query'),
      '@tanstack/react-form':         nm('@tanstack/react-form'),
      '@tanstack/react-table':        nm('@tanstack/react-table'),
    },
  },
  build: {
    // The Designer route (fabric + cellar-canvas) and the PDF vendor bundle
    // each clear the default 500 kB warning; both are lazy-loaded and only
    // landed when the user opens /designer or clicks "Export PDF".
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Manual vendor chunks: stable libraries land in long-lived files
        // so their hashes don't change when only app code is touched.
        // The browser can keep the cached vendor bundle across deploys
        // and only re-fetches whichever group actually changed.
        //
        // Each branch matches by exact package name (with trailing slash)
        // so e.g. `react-router` doesn't accidentally match `react`.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react'
          }
          if (id.includes('/react-router/')) return 'vendor-router'
          if (id.includes('/motion/') || id.includes('/framer-motion/')) return 'vendor-motion'
          if (id.includes('/@tanstack/')) return 'vendor-tanstack'
          if (id.includes('/@ark-ui/') || id.includes('/@zag-js/')) return 'vendor-ui'
          // Heavy designer-only deps — co-located so the designer route loads
          // them on demand alongside its page chunk, not on first paint.
          if (id.includes('/fabric/'))                               return 'vendor-fabric'
          if (id.includes('/jspdf/') || id.includes('/html2canvas/')) return 'vendor-pdf'
          if (id.includes('/qrcode/'))                                return 'vendor-qrcode'
        },
      },
    },
  },
}))
