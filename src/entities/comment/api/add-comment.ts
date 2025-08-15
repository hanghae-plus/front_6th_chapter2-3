import { client } from '@/shared/configs';
import type { Comment } from '@/entities/comment/model';

export type AddCommentPayload = {
  body: string;
  postId: number;
  userId: number;
};

export async function addComment(payload: AddCommentPayload): Promise<Comment> {
  return client.post<Comment>('/comments/add', payload);
}
