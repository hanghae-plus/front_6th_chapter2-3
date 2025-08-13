export const POST = {
  LIST: (paramString: string) => `/api/posts?${paramString}`,
  TAG_LIST: '/api/posts/tags',

  BY_SEARCH: (searchQuery: string, paramString: string) =>
    `/api/posts/search?q=${searchQuery}&${paramString}`,
  BY_TAG: (tag: string, paramString: string) =>
    `/api/posts/tag/${tag}?${paramString}`,

  ADD: '/api/posts/add',
  UPDATE: (postId: number) => `/api/posts/${postId}`,
  DELETE: (postId: number) => `/api/posts/${postId}`,
};
