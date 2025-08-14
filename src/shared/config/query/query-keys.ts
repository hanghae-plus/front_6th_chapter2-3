export const QUERY_KEYS = {
  posts: (
    limit: number,
    skip: number,
    searchQuery: string,
    selectedTag: string,
    sortBy: string,
    sortOrder: string,
  ) => ['posts', limit, skip, searchQuery, selectedTag, sortBy, sortOrder],
  postsTags: () => ['postsTags'],
  postComments: (postId: number) => ['postComments', postId],
  postCommentLike: (postId: number, commentId: number) => [
    'postCommentLike',
    postId,
    commentId,
  ],
};
