import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  base: process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-3/' : '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },

  server: {
    proxy:
      process.env.NODE_ENV === 'development'
        ? {
            '/api': {
              target: 'https://dummyjson.com',
              changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, ''),
            },
          }
        : {},
  },
});
