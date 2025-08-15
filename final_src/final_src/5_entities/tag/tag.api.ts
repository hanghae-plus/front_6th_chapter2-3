import { Tag } from '@/entities/tag';
import { ApiService } from '@/shared/lib';

export const getTags = async (): Promise<Tag[]> => {
  return ApiService.get<Tag[]>('/posts/tags');
};
