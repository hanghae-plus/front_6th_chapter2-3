export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (params: { skip?: number; limit?: number; tag?: string; search?: string } = {}) =>
    [...postsKeys.lists(), params] as const,
  detail: (id: number) => [...postsKeys.all, 'detail', id] as const,
  tags: ['tags'] as const,
} as const
