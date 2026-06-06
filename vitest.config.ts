import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './components'),
      '@': path.resolve(__dirname, './vendure-showcase/storefront/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['components/**/*.test.{ts,tsx}', 'vendure-showcase/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
})
