import { client } from '@/shared/configs';
import type { Tag } from '@/entities/tag/model';

export async function getTags(): Promise<Tag[]> {
  return client.get<Tag[]>('/posts/tags');
}
