import { getPosts, getPostsTags } from './remote';
import { useQuery } from '@tanstack/react-query';

export const usePosts = (
  limit: number,
  skip: number,
  searchQuery: string = '',
  selectedTag: string = '',
) => {
  return useQuery({
    queryKey: ['posts', limit, skip, searchQuery, selectedTag],
    queryFn: () => getPosts(limit, skip, searchQuery, selectedTag),
  });
};

export const usePostsTags = () => {
  return useQuery({
    queryKey: ['postsTags'],
    queryFn: () => getPostsTags(),
  });
};
