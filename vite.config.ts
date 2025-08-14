import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/front_6th_chapter2-3/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
