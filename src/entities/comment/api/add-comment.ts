import type { Comment } from '@/entities/comment/model';

export type AddCommentPayload = {
  body: string;
  postId: number;
  userId: number;
};

export async function addComment(payload: AddCommentPayload): Promise<Comment> {
  const res = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
