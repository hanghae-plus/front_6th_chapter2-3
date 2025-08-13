import type { PostsResponse, PostsTagsResponse } from '../types';
import { remote } from '@/shared/api/remote';

export const getPosts = async (
  limit: number,
  skip: number,
  searchQuery: string,
  selectedTag: string,
): Promise<PostsResponse> => {
  if (searchQuery) {
    return await remote(`/api/posts/search?q=${searchQuery}`);
  }

  if (selectedTag) {
    return await remote(`/api/posts/tag/${selectedTag}`);
  }

  return await remote(`/api/posts?limit=${limit}&skip=${skip}`);
};

export const getPostsTags = async (): Promise<PostsTagsResponse> => {
  return await remote('/api/posts/tags');
};
