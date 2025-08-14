import {
  BaseFilterParams,
  GetPostsResponse,
  ParamsWithSearch,
  ParamsWithTag,
  Post,
  POST_CONSTANTS,
  SORT_ORDER,
} from '@/entities/post';
import { getSearchParams } from '@/shared/lib';

export const getPosts = async ({
  limit = POST_CONSTANTS.DEFAULT_LIMIT,
  skip = POST_CONSTANTS.DEFAULT_SKIP,
  sortBy,
  sortOrder,
}: BaseFilterParams): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit.toString(),
    skip: skip.toString(),
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  });

  const response = await fetch(`/api/posts?${params.toString()}`);
  return response.json();
};

export const getPostsByTag = async ({
  selectedTag,
  limit,
  skip,
  sortBy,
  sortOrder,
}: ParamsWithTag): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  });

  const response = await fetch(
    `/api/posts/tag/${selectedTag}?${params.toString()}`
  );
  return response.json();
};

export const getPostsBySearch = async ({
  searchQuery,
  limit,
  skip,
  sortBy,
  sortOrder,
}: ParamsWithSearch): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    searchQuery,
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  });

  const response = await fetch(`/api/posts/search?${params.toString()}`);
  return response.json();
};

export const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  return response.json();
};

export const putPost = async (updatedPost: Post): Promise<Post> => {
  const response = await fetch(`/api/posts/${updatedPost.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  });
  return response.json();
};

export const deletePost = async (postId: number) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
  return response.json();
};
