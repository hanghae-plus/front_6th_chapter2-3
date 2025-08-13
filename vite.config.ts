import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, './src/1_app'),
      '@/app/*': path.resolve(__dirname, './src/1_app/*'),
      '@/pages': path.resolve(__dirname, './src/2_pages'),
      '@/pages/*': path.resolve(__dirname, './src/2_pages/*'),
      '@/widgets': path.resolve(__dirname, './src/3_widgets'),
      '@/widgets/*': path.resolve(__dirname, './src/3_widgets/*'),
      '@/features': path.resolve(__dirname, './src/4_features'),
      '@/features/*': path.resolve(__dirname, './src/4_features/*'),
      '@/entities': path.resolve(__dirname, './src/5_entities'),
      '@/entities/*': path.resolve(__dirname, './src/5_entities/*'),
      '@/shared': path.resolve(__dirname, './src/6_shared'),
      '@/shared/*': path.resolve(__dirname, './src/6_shared/*'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'https://jsonplaceholder.typicode.com',
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
