import { client } from '@/shared/configs';
import { enrichPostsWithAuthors } from '../lib';
import type { Post } from '@/entities/post/model';

export async function searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
  const response = await client.get<{ posts: Post[]; total: number }>('/posts/search', {
    q: query,
  });

  if (response.posts) {
    const postsWithAuthors = await enrichPostsWithAuthors(response.posts);
    return {
      ...response,
      posts: postsWithAuthors,
    };
  }

  return response;
}
