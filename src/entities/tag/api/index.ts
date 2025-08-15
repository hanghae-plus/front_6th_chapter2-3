import { apiClient } from '../../../shared';
import { TagType } from '../model';

export const getTags = async (): Promise<TagType[]> => {
  return apiClient.get('/posts/tags');
};

export * from './queries';
