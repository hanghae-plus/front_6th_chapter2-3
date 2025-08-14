import type { Post } from '@/entities/post/model';

export async function addPost(payload: Omit<Post, 'id' | 'reactions' | 'tags'>): Promise<Post> {
  const res = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add post');
  return res.json();
}
