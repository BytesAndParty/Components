import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./src', import.meta.url));
const monorepoComponents = fileURLToPath(new URL('../../components', import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': root,
        '@components': monorepoComponents,
      },
    },
  },
  output: 'static',
  server: {
    port: 5173,
    proxy: {
      '/shop-api': 'http://localhost:3000',
      '/assets': 'http://localhost:3000',
    },
  },
});
