import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const base: string = process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-3/' : '';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base,
  server: {
    proxy: {
      '/api': {
        // target: 'https://jsonplaceholder.typicode.com',
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
