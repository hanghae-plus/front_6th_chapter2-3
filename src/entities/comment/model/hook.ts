import { useQuery } from '@tanstack/react-query';
import { IComments } from './type';
import { getCommentsApi } from '../api/comment-api';

/**
 * 특정 게시물 댓글 목록 조회
 */
export const useCommentsQuery = (postId: number) => {
  return useQuery<IComments>({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsApi(postId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
