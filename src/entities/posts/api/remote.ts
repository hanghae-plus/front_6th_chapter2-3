import type {
  AddPostCommentResponse,
  Post,
  PostCommentsResponse,
  PostsResponse,
  PostsTagsResponse,
} from '../model';
import { remote } from '@/shared/api';

export const getPosts = async (
  limit: number,
  skip: number,
  searchQuery: string,
  selectedTag: string,
): Promise<PostsResponse> => {
  if (searchQuery) {
    return await remote(`/api/posts/search?q=${searchQuery}`);
  }

  if (selectedTag) {
    return await remote(`/api/posts/tag/${selectedTag}`);
  }

  return await remote(`/api/posts?limit=${limit}&skip=${skip}`);
};

export const getPostsTags = async (): Promise<PostsTagsResponse> => {
  return await remote('/api/posts/tags');
};

export const getPostComments = async (
  postId: number,
): Promise<PostCommentsResponse> => {
  return await remote(`/api/comments/post/${postId}`);
};

export const patchPostCommentLike = async (
  commentId: number,
  likes: number,
) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes }),
  });
};

export const deletePostComment = async (commentId: number) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
};

export const addPostComment = async (
  postId: number,
  userId: number,
  body: string,
): Promise<AddPostCommentResponse> => {
  return await remote('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, postId, userId }),
  });
};

export const updatePost = async (postId: number, post: Post): Promise<Post> => {
  return await remote(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
};

export const deletePost = async (postId: number) => {
  return await remote(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
};
