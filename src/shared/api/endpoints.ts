export const API_ENDPOINTS = {
  // Posts API
  POSTS: {
    LIST: '/api/posts',
    ADD: '/api/posts/add',
    UPDATE: (id: number) => `/api/posts/${id}`,
    DELETE: (id: number) => `/api/posts/${id}`,
    SEARCH: (query: string) => `/api/posts/search?q=${query}`,
    BY_TAG: (tag: string) => `/api/posts/tag/${tag}`,
    TAGS: '/api/posts/tags',
  },

  // Users API
  USERS: {
    GET: (id: number) => `/api/users/${id}`,
    LIST: '/api/users?limit=0&select=username,image',
  },

  // Comments API
  COMMENTS: {
    BY_POST: (postId: number) => `/api/comments/post/${postId}`,
    ADD: '/api/comments/add',
    UPDATE: (id: number) => `/api/comments/${id}`,
    DELETE: (id: number) => `/api/comments/${id}`,
  },
} as const;
