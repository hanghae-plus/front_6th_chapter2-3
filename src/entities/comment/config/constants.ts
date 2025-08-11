export const COMMENT = {
  LIST: (postId: number) => `/api/comments/post/${postId}`,

  ADD: '/api/comments/add',
  UPDATE: (commentId: number) => `/api/comments/${commentId}`,
  DELETE: (id: number) => `/api/comments/${id}`,
  LIKE: (id: number) => `/api/comments/${id}`,
};
