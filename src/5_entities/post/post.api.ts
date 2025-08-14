import { PaginationResponse } from '@/shared/types';

import { Post } from './post.type';

export interface GetPostsParams {
  limit: number;
  skip: number;
}

export interface GetPostsResponse extends PaginationResponse {
  posts: Post[];
}

export const getPosts = async ({
  limit,
  skip,
}: GetPostsParams): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
};

export const getPostsByTag = async ({
  tag,
}: {
  tag: string;
}): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}`);
  return response.json();
};

export interface GetPostsBySearchParams {
  search: string;
}

export const getPostsBySearch = async ({
  search,
}: GetPostsBySearchParams): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts/search?q=${search}`);
  return response.json();
};

export const postPost = async () => {};

export const putPost = async () => {};

export const deletePost = async () => {};

export const getPost = async () => {};
