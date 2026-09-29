import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  // Rollup tree-shaking strips module directives; keep it off so 'use client' survives.
  treeshake: false,
  minify: false,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-markdown', 'remark-gfm'],
  banner: { js: "'use client';" },
  onSuccess: 'cp src/tokens/theme.css dist/theme.css',
});
