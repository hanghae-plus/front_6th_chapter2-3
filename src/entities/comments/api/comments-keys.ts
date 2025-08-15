export const commentsKeys = {
  all: ['comments'] as const,
  byPost: (postId: number) => [...commentsKeys.all, 'post', postId] as const,
  detail: (id: number) => [...commentsKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...commentsKeys.all, 'mutation', 'create'] as const,
    update: (id: number) => [...commentsKeys.all, 'mutation', 'update', id] as const,
    delete: (id: number) => [...commentsKeys.all, 'mutation', 'delete', id] as const,
    like: (id: number) => [...commentsKeys.all, 'mutation', 'like', id] as const,
  },
};