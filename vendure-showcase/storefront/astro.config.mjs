import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
  output: 'static',
  server: {
    port: 5173,
    proxy: {
      '/shop-api': 'http://localhost:3000',
      '/assets': 'http://localhost:3000',
    }
  }
});
