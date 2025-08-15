import { client } from '@/shared/configs';
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
  return client.get<GetPostsResponse>('/posts', params);
}
