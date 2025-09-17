import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'rage-wasm': ['@kanru/rage-wasm']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
