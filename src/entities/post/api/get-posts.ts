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
  const { limit, skip } = params;
  const res = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}
