import { client } from '@/shared/configs';

export async function deletePost(postId: number): Promise<void> {
  await client.delete<void>(`/posts/${postId}`);
}
