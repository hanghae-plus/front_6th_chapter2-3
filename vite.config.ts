import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      '@/app': path.resolve(__dirname, './src/1_app/index.ts'),
      '@/app/*': path.resolve(__dirname, './src/1_app/*'),

      '@/pages': path.resolve(__dirname, './src/2_pages/index.ts'),
      '@/pages/*': path.resolve(__dirname, './src/2_pages/*'),

      '@/widgets': path.resolve(__dirname, './src/3_widgets/index.ts'),
      '@/widgets/*': path.resolve(__dirname, './src/3_widgets/*'),

      '@/features': path.resolve(__dirname, './src/4_features/index.ts'),
      '@/features/*': path.resolve(__dirname, './src/4_features/*'),

      '@/entities': path.resolve(__dirname, './src/5_entities/index.ts'),
      '@/entities/*': path.resolve(__dirname, './src/5_entities/*'),

      '@/shared': path.resolve(__dirname, './src/6_shared/index.ts'),
      '@/shared/*': path.resolve(__dirname, './src/6_shared/*'),
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
