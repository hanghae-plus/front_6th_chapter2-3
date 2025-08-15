import { client } from '@/shared/configs';
import type { Post } from '@/entities/post/model';

export async function addPost(payload: Omit<Post, 'id' | 'reactions' | 'tags'>): Promise<Post> {
  return client.post<Post>('/posts/add', payload);
}
