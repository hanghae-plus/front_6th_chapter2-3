import type { Post } from '@/entities/post/model';

export async function updatePost(postId: number, patch: Partial<Post>): Promise<Post> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}
