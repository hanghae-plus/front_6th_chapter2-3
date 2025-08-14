import { TagType } from '../model';

export const getTags = async (): Promise<TagType[]> => {
  const response = await fetch('/api/posts/tags');
  return response.json();
};

export * from './queries';
