import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    plugins: [react()],
    base: '/front_6th_chapter2-3/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            query: ['@tanstack/react-query'],
          },
        },
      },
    },
    server: {
      proxy: isDev
        ? {
            '/api': {
              target: 'https://dummyjson.com',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
  }
})
