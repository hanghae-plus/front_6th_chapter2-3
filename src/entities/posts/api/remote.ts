import type {
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
