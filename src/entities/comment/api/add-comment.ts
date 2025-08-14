import type { Comment } from '@/entities/comment/model';

export async function addComment(payload: Omit<Comment, 'id'>): Promise<Comment> {
  const res = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
