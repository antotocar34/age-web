import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/', // local dev stays at '/',
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
