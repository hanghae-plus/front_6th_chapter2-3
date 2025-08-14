import type { Comment } from '@/entities/comment/model';

export async function updateComment(commentId: number, patch: Partial<Comment>): Promise<Comment> {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}
