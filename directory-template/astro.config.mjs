// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // Will be replaced per-directory
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
