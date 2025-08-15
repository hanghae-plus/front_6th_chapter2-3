import { client } from '@/shared/configs';
import { enrichPostsWithAuthors } from '../lib';
import type { Post } from '@/entities/post/model';

export type GetPostsParams = {
  limit: number;
  skip: number;
};

export type GetPostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export async function getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
  const response = await client.get<GetPostsResponse>('/posts', params);

  if (response.posts) {
    const postsWithAuthors = await enrichPostsWithAuthors(response.posts);
    return {
      ...response,
      posts: postsWithAuthors,
    };
  }

  return response;
}
