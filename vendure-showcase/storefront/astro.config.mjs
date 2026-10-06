import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./src', import.meta.url));
const monorepoComponents = fileURLToPath(new URL('../../components', import.meta.url));

// Im kombinierten Netlify-Build liegt die Storefront unter /shop; das setzt
// scripts/build-all.mjs über DEPLOY_SUBPATH. Lokal (`astro dev`) bleibt base '/'.
// Interne Links laufen über withBase() in src/lib/utils.ts.
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
  },
});
