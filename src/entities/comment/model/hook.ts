import { useQuery } from '@tanstack/react-query';
import { IComments } from './type';
import { getCommentsApi } from '../api/comment-api';

export const useCommentsQuery = (postId: number) => {
  return useQuery<IComments>({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsApi(postId),
  });
};
