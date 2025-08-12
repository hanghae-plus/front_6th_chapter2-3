export const URL_PATH = {
  // 게시물 관련 API
  POSTS: {
    LIST: "/api/posts",
    SEARCH: "/api/posts/search",
    TAGS: "/api/posts/tags",
    BY_TAG: (tag: string) => `/api/posts/tag/${tag}`,
    ADD: "/api/posts/add",
    UPDATE: (id: number) => `/api/posts/${id}`,
    DELETE: (id: number) => `/api/posts/${id}`,
  },

  // 사용자 관련 API
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: number) => `/api/users/${id}`,
  },

  // 댓글 관련 API
  COMMENTS: {
    BY_POST: (postId: number) => `/api/comments/post/${postId}`,
    ADD: "/api/comments/add",
    UPDATE: (id: number) => `/api/comments/${id}`,
    DELETE: (id: number) => `/api/comments/${id}`,
  },
}
