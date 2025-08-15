import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'jotai';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface AppProviderProps {
  children: React.ReactNode;
}

// 애플리케이션 레벨의 QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * 애플리케이션 레벨 프로바이더
 *
 * FSD Best Practice:
 * - 애플리케이션 초기화 로직을 중앙화
 * - 전역 상태 관리 설정
 * - 라우팅 설정
 * - 개발 도구 설정
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router>{children}</Router>
      </QueryClientProvider>
    </Provider>
  );
};
