import type { PostComment } from '../types';

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

export const getLikes = (comments: PostComment[], commentId: number) => {
  return comments.find((comment) => comment.id === commentId)?.likes ?? null;
};

export const deleteComment = (comments: PostComment[], commentId: number) => {
  return comments.filter((comment) => comment.id !== commentId);
};

export const addComment = (comments: PostComment[], comment: PostComment) => {
  return [...comments, comment];
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
