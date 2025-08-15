import { QueryClient } from '@tanstack/react-query';

// QueryClient 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 재시도 설정
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 3번 재시도
        return failureCount < 3;
      },

      // 윈도우 포커스 시 재요청 방지
      refetchOnWindowFocus: false,

      // 데이터 신선도 시간 (5분)
      staleTime: 5 * 60 * 1000,

      // 가비지 컬렉션 시간 (10분)
      gcTime: 10 * 60 * 1000,

      // 네트워크 재연결 시 재요청
      refetchOnReconnect: true,

      // 에러 발생 시 재요청 간격
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    mutations: {
      // 뮤테이션 재시도 설정
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 2번 재시도
        return failureCount < 2;
      },

      // 재시도 간격
      retryDelay: 1000,
    },
  },
});

// 쿼리 키 팩토리 함수들
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.comments.lists(), filters] as const,
    details: () => [...queryKeys.comments.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.comments.details(), id] as const,
  },
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
  },
};
