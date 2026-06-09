// @ts-check
// astro.config.mjs — Configuración principal de Astro.
// Tailwind CSS v4 ya no usa PostCSS; requiere el plugin oficial de Vite (@tailwindcss/vite).
// Esto habilita el procesado de @import "tailwindcss" en global.css y los tokens @theme inline.

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});