import { client } from '@/shared/configs';

export async function deleteComment(commentId: number): Promise<void> {
  await client.delete<void>(`/comments/${commentId}`);
}
