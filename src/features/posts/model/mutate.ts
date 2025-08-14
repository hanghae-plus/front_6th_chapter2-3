import type { Post, PostComment } from '@/entities/posts';

export const deletePostData = (posts: Post[], postId: number) => {
  return posts.filter((post) => post.id !== postId);
};

export const addCommentData = (
  comments: PostComment[],
  comment: PostComment,
) => {
  return [...comments, comment];
};

export const editPostData = (
  posts: Post[],
  postId: number,
  updatedPost: Post,
) => {
  return posts.map((post) => (post.id === postId ? updatedPost : post));
};

export const updateComment = (
  comments: PostComment[],
  commentId: number,
  body: string,
) => {
  return comments.map((comment) =>
    comment.id === commentId ? { ...comment, body } : comment,
  );
};

export const incrementCommentLike = (
  comments: PostComment[],
  commentId: number,
) => {
  return comments.map((comment) =>
    comment.id === commentId
      ? { ...comment, likes: comment.likes + 1 }
      : comment,
  );
};

export const deleteComment = (comments: PostComment[], commentId: number) => {
  return comments.filter((comment) => comment.id !== commentId);
};
