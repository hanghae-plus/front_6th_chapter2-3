/**
 * 쿼리 키 관리 시스템
 * FSD 아키텍처에 맞게 도메인별로 쿼리 키를 관리합니다.
 */

export const queryKeys = {
  // Posts 관련 쿼리 키
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (params: { limit: number; skip: number; searchQuery?: string; tag?: string }) =>
      [...queryKeys.posts.lists(), params] as const,
    search: (query: string) => [...queryKeys.posts.all, 'search', query] as const,
    byTag: (tag: string) => [...queryKeys.posts.all, 'tag', tag] as const,
    detail: (id: number) => [...queryKeys.posts.all, 'detail', id] as const,
  },

  // Comments 관련 쿼리 키
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    byPost: (postId: number) => [...queryKeys.comments.lists(), 'post', postId] as const,
    detail: (id: number) => [...queryKeys.comments.all, 'detail', id] as const,
  },

  // Tags 관련 쿼리 키
  tags: {
    all: ['tags'] as const,
    list: () => [...queryKeys.tags.all, 'list'] as const,
  },

  // Users 관련 쿼리 키
  users: {
    all: ['users'] as const,
    detail: (id: number) => [...queryKeys.users.all, 'detail', id] as const,
  },
} as const;
