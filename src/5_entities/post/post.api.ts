import { PaginationResponse } from '@/shared/types';

import { Post } from './post.type';

export interface GetPostsParams {
  limit: number;
  skip: number;
}

export interface GetPostsResponse extends PaginationResponse {
  posts: Post[];
}

export const getPosts: ({
  limit,
  skip,
}: GetPostsParams) => Promise<GetPostsResponse> = async ({ limit, skip }) => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
};

export const postPost = async () => {};

export const putPost = async () => {};

export const deletePost = async () => {};

export const getPost = async () => {};
