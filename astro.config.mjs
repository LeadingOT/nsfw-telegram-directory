import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://nsfwtelegrambot.com',
  output: 'server',
  adapter: vercel(),
  
  vite: {
    plugins: [tailwindcss()]
  },
  
  integrations: [
  ],
  
  build: {
    format: 'directory',
  },
});
