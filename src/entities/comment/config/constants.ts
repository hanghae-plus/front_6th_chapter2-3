const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const COMMENT = {
  LIST: (postId: number) => `${BASE_URL}/comments/post/${postId}`,

  ADD: '${BASE_URL}/comments/add',
  UPDATE: (commentId: number) => `${BASE_URL}/comments/${commentId}`,
  DELETE: (id: number) => `${BASE_URL}/comments/${id}`,
  LIKE: (id: number) => `${BASE_URL}/comments/${id}`,
};
