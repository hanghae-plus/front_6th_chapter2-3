import type { Post, SortOrder } from '../types';

export const sortPostsByReactions = (
  posts: Post[],
  sortOrder: SortOrder,
): Post[] => {
  return posts.sort((a, b) => {
    const aReactions = a.reactions.likes + a.reactions.dislikes;
    const bReactions = b.reactions.likes + b.reactions.dislikes;

    return sortOrder === 'asc'
      ? aReactions - bReactions
      : bReactions - aReactions;
  });
};

export const slicePosts = (
  posts: Post[],
  skip: number,
  limit: number,
): Post[] => {
  return posts.slice(skip, skip + limit);
};

export const updatePost = (
  posts: Post[],
  postId: number,
  updatedPost: Post,
) => {
  return posts.map((post) => (post.id === postId ? updatedPost : post));
};

export const deletePost = (posts: Post[], postId: number) => {
  return posts.filter((post) => post.id !== postId);
};

export const addPost = (posts: Post[], newPost: Post) => {
  return [newPost, ...posts];
};
