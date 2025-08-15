import { client } from '@/shared/configs';
import type { Comment } from '@/entities/comment/model';

export async function getCommentsByPost(postId: number): Promise<{ comments: Comment[] }> {
  return client.get<{ comments: Comment[] }>(`/comments/post/${postId}`);
}
