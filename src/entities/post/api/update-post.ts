import { client } from '@/shared/configs';
import type { Post } from '@/entities/post/model';

export async function updatePost(postId: number, patch: Partial<Post>): Promise<Post> {
  return client.put<Post>(`/posts/${postId}`, patch);
}
