import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // GitHub Pages 배포 시에만 base 경로 설정
  const base =
    mode === 'production' && process.env.GITHUB_PAGES === 'true' ? '/front_6th_chapter2-3/' : './';

  return {
    plugins: [react()],
    base: base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 별칭 적용 안했으면 빼도됨
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // 프로덕션에서는 소스맵 비활성화
      minify: 'esbuild', // terser 대신 esbuild 사용
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://dummyjson.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // 배포 환경에서도 API 호출이 작동하도록 define 설정
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  };
});
