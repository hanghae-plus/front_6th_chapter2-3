import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const base =
  process.env.NODE_ENV === 'production' ? '/front_6th_chapter2-3/' : ''

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tsconfigPaths()],

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
})
