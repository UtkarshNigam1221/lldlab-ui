import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Used by Ladle only (vitest reads vitest.config.ts).
export default defineConfig({ plugins: [tailwindcss()] });
