import { client } from '@/shared/configs';
import type { Comment } from '@/entities/comment/model';

export async function updateComment(commentId: number, patch: Partial<Comment>): Promise<Comment> {
  return client.put<Comment>(`/comments/${commentId}`, patch);
}
