import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: path.resolve(__dirname, '../_public_'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, '../components'),
      // Let components outside showcase/ resolve deps from showcase/node_modules
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react'),
      '@radix-ui/react-dropdown-menu': path.resolve(__dirname, 'node_modules/@radix-ui/react-dropdown-menu'),
      '@number-flow/react': path.resolve(__dirname, 'node_modules/@number-flow/react'),
      'lottie-react': path.resolve(__dirname, 'node_modules/lottie-react'),
      'gsap': path.resolve(__dirname, 'node_modules/gsap'),
      'canvas-confetti': path.resolve(__dirname, 'node_modules/canvas-confetti'),
      '@chenglou/pretext': path.resolve(__dirname, 'node_modules/@chenglou/pretext'),
      '@ark-ui/react': path.resolve(__dirname, 'node_modules/@ark-ui/react'),
    },
  },
})
