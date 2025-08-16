import { apiClient } from '../../../shared';
import {
  GetPostsListResponseType,
  GetPostsListRequestType,
  PostPostRequestType,
  PutPostRequestType,
} from '../model';

export const getPosts = async (
  params: GetPostsListRequestType,
): Promise<GetPostsListResponseType> => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.skip) searchParams.append('skip', params.skip.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const endpoint = `/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return apiClient.get(endpoint);
};

export const getPostsBySearch = async (
  search: string,
  params?: GetPostsListRequestType,
): Promise<GetPostsListResponseType> => {
  const searchParams = new URLSearchParams();
  searchParams.append('q', search);

  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.skip) searchParams.append('skip', params.skip.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  return apiClient.get(`/posts/search?${searchParams.toString()}`);
};

export const getPostsByTag = async (
  tag: string,
  params?: GetPostsListRequestType,
): Promise<GetPostsListResponseType> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.skip) searchParams.append('skip', params.skip.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const endpoint = `/posts/tag/${tag}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return apiClient.get(endpoint);
};

export const postPost = async (post: PostPostRequestType) => {
  return apiClient.post('/posts/add', post);
};

export const putPost = async (post: PutPostRequestType) => {
  return apiClient.put(`/posts/${post.id}`, post);
};

export const deletePost = async (id: number) => {
  return apiClient.delete(`/posts/${id}`);
};

export * from './mutations';
export * from './queries';
