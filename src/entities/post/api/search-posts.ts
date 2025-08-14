import type { Post } from '@/entities/post/model';

export async function searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search posts');
  return res.json();
}
