const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const POST = {
  LIST: (paramString: string) => `${BASE_URL}/posts?${paramString}`,
  TAG_LIST: `${BASE_URL}/posts/tags`,

  BY_SEARCH: (searchQuery: string, paramString: string) =>
    `${BASE_URL}/posts/search?q=${searchQuery}&${paramString}`,
  BY_TAG: (tag: string, paramString: string) =>
    `${BASE_URL}/posts/tag/${tag}?${paramString}`,

  ADD: `${BASE_URL}/posts/add`,
  UPDATE: (postId: number) => `${BASE_URL}/posts/${postId}`,
  DELETE: (postId: number) => `${BASE_URL}/posts/${postId}`,
};
