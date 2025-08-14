import { Tag } from '@/entities/tag';

export const getTags = async (): Promise<{ tags: Tag[] }> => {
  const response = await fetch('/api/posts/tags');
  return response.json();
};
