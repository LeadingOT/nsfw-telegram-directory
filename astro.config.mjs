// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://nsfwtelegrambot.com',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
