import type { Comment } from '@/entities/comment/model';

export async function likeComment(commentId: number, currentLikes: number): Promise<Comment> {
  const res = await fetch(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  });
  if (!res.ok) throw new Error('Failed to like comment');
  return res.json();
}
