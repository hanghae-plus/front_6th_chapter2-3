import {
  GetPostsByTagParams,
  GetPostsResponse,
  GetPostsWithFiltersParams,
  Post,
  POST_CONSTANTS,
  SORT_BY,
  SORT_ORDER,
} from '@/entities/post';
import { getSearchParams } from '@/shared/lib';
import { EmptyStringable, SortOrder } from '@/shared/types';

export interface GetPostsParams {
  limit: number;
  skip: number;
  sortBy?: EmptyStringable<SORT_BY>;
  sortOrder?: SortOrder;
}

export const getPosts = async ({
  limit = POST_CONSTANTS.DEFAULT_LIMIT,
  skip = POST_CONSTANTS.DEFAULT_SKIP,
  sortBy,
  sortOrder,
}: GetPostsParams): Promise<GetPostsResponse> => {
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
  tag,
  limit,
  skip,
  sortBy,
  sortOrder,
}: GetPostsByTagParams): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  });

  const response = await fetch(`/api/posts/tag/${tag}?${params.toString()}`);
  return response.json();
};

export interface GetPostsBySearchParams extends GetPostsParams {
  search: string;
}

export const getPostsBySearch = async ({
  search,
  limit,
  skip,
  sortBy,
  sortOrder,
}: GetPostsBySearchParams): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    searchQuery: search,
  });

  const response = await fetch(`/api/posts/search?${params.toString()}`);
  return response.json();
};

export const getPostsWithFilters = async ({
  limit,
  skip,
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
}: GetPostsWithFiltersParams): Promise<GetPostsResponse> => {
  const params = getSearchParams({
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    searchQuery: searchQuery || '',
    selectedTag: selectedTag || '',
    sortBy: sortBy || '',
    sortOrder: sortOrder || '',
  });

  const response = await fetch(`/api/posts?${params.toString()}`);
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
