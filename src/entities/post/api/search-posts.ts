import { client } from '@/shared/configs';
import type { Post } from '@/entities/post/model';

export async function searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
  return client.get<{ posts: Post[]; total: number }>('/posts/search', { q: query });
}
