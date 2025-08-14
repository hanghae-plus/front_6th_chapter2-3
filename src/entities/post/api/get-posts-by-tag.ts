import type { Post } from '@/entities/post/model';

export async function getPostsByTag(tag: string): Promise<{ posts: Post[]; total: number }> {
  const res = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`);
  if (!res.ok) throw new Error('Failed to fetch posts by tag');
  return res.json();
}
