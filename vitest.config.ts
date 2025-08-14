/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/front_6th_chapter2-3/',
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
