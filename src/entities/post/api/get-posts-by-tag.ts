import { client } from '@/shared/configs';
import type { Post } from '@/entities/post/model';

export async function getPostsByTag(tag: string): Promise<{ posts: Post[]; total: number }> {
  return client.get<{ posts: Post[]; total: number }>(`/posts/tag/${encodeURIComponent(tag)}`);
}
