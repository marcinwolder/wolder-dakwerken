// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    // The map is imported lazily, so without this Vite finds these deps late and re-optimizes mid-session.
    optimizeDeps: {
      include: ['leaflet', 'react-leaflet', 'react-dom/server', 'react-icons/fa']
    }
  }
});