// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://marcinwolder.github.io',
  base: '/wolder-dakwerken',
  integrations: [react()],
  devToolbar: { enabled: false },

  vite: {
    plugins: [tailwindcss()],
    // Without this Vite finds these deps late (the map is imported lazily, each page has its own
    // islands) and re-optimizes mid-session. Islands then fail to hydrate with
    // "504 Outdated Optimize Dep" until a reload. List every third-party import here.
    optimizeDeps: {
      include: [
        '@hookform/resolvers/zod',
        '@nanostores/react',
        'classnames',
        'leaflet',
        'libphonenumber-js',
        'nanostores',
        'react-dom/server',
        'react-hook-form',
        'react-icons/bs',
        'react-icons/fa',
        'react-icons/fa6',
        'react-icons/io5',
        'react-leaflet',
        'zod'
      ]
    }
  }
});