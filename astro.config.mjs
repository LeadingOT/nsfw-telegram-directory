// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://nsfwtelegrambot.com',
  output: 'hybrid',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
