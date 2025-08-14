import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

const base =
  process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-3/' : '';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
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
      '@final_src': path.resolve(__dirname, './src/final_src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
