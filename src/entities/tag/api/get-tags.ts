import type { Tag } from '@/entities/tag/model';

export async function getTags(): Promise<Tag[]> {
  const res = await fetch('/api/posts/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}
