import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./src', import.meta.url));
const monorepoComponents = fileURLToPath(new URL('../../components', import.meta.url));

// In the combined Netlify build the storefront is nested under /shop; the build
// command sets DEPLOY_SUBPATH. Local `astro dev` leaves base at '/'.
const base = process.env.DEPLOY_SUBPATH || undefined;

// https://astro.build/config
export default defineConfig({
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
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
