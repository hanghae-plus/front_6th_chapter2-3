export const POST = {
  LIST: (limit: number, skip: number) =>
    `/api/posts?limit=${limit}&skip=${skip}`,
  BY_SEARCH: (searchQuery: string) => `/api/posts/search?q=${searchQuery}`,
  BY_TAG: (tag: string) => `/api/posts/tag/${tag}`,

  ADD: '/api/posts/add',
  UPDATE: (postId: number) => `/api/posts/${postId}`,
  DELETE: (postId: number) => `/api/posts/${postId}`,
};
