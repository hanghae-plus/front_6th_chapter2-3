import { client } from '@/shared/configs';
import type { Comment } from '@/entities/comment/model';

export async function likeComment(commentId: number, currentLikes: number): Promise<Comment> {
  return client.patch<Comment>(`/comments/${commentId}`, { likes: currentLikes + 1 });
}
