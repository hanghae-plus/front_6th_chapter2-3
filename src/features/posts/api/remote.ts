import type {
  AddCommentResponse,
  AddPostRequest,
  AddPostResponse,
  UpdatePostCommentRequest,
  UpdatePostCommentResponse,
} from './types';
import type { Post } from '@/entities/posts';
import { remote } from '@/shared/api';

export const editPost = async (postId: number, post: Post): Promise<Post> => {
  return await remote(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: post,
  });
};

export const updatePostComment = async (
  commentId: number,
  commentData: UpdatePostCommentRequest,
): Promise<UpdatePostCommentResponse> => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: commentData,
  });
};

export const addPostComment = async (
  postId: number,
  userId: number,
  body: string,
): Promise<AddCommentResponse> => {
  return await remote('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { body, postId, userId },
  });
};

export const addPost = async (
  postData: AddPostRequest,
): Promise<AddPostResponse> => {
  return await remote('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: postData,
  });
};

export const deletePost = async (postId: number) => {
  return await remote(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
};

export const patchPostCommentLike = async (
  commentId: number,
  likes: number,
) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: { likes },
  });
};

export const deletePostComment = async (commentId: number) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
};
