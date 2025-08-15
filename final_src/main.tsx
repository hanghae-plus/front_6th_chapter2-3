import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App, AppProvider } from '@/app';
import '@/index.css';

/**
 * 애플리케이션 진입점
 *
 * FSD Best Practice:
 * - 애플리케이션 초기화
 * - 프로바이더 설정
 * - 개발 모드 설정
 * - 에러 바운더리 설정 (필요시)
 */
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
