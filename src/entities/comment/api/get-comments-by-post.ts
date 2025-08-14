import type { Comment } from '@/entities/comment/model';

export async function getCommentsByPost(postId: number): Promise<{ comments: Comment[] }> {
  const res = await fetch(`/api/comments/post/${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}
