export const POST_QUERY_KEYS = {
  posts: (
    limit: number,
    skip: number,
    searchQuery: string,
    selectedTag: string,
    sortBy: string,
    sortOrder: string,
  ) =>
    [
      'posts',
      limit,
      skip,
      searchQuery,
      selectedTag,
      sortBy,
      sortOrder,
    ] as const,

  postsTags: () => ['posts', 'tags'] as const,

  postComments: (postId: number) => ['posts', 'comments', postId] as const,

  postCommentLike: (postId: number, commentId: number) =>
    ['posts', 'comments', 'like', postId, commentId] as const,
} as const;
