import { Tag } from '@/entities/tag';

export const getTags = async (): Promise<Tag[]> => {
  const response = await fetch('/api/posts/tags');
  return response.json();
};
