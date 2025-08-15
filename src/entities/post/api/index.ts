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

  const url = `/api/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  return response.json();
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

  const response = await fetch(`/api/posts/search?${searchParams.toString()}`);
  return response.json();
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

  const url = `/api/posts/tag/${tag}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  return response.json();
};

export const postPost = async (post: PostPostRequestType) => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return response.json();
};

export const putPost = async (post: PutPostRequestType) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return response.json();
};

export const deletePost = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export * from './mutations';
export * from './queries';
