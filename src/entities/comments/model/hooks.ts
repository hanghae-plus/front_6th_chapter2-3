import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentsApi } from '../api';
import { PostAddComment } from '../model/types.ts';

export const useComments = () => {
  const queryClient = useQueryClient();

  return {
    useGetComment: (id: number) => {
      return useQuery({
        queryKey: ['comments'],
        queryFn: () => commentsApi.getComments(id),
      });
    },
    useCreateComments: () => {
      return useMutation({
        mutationFn: (comment: PostAddComment) =>
          commentsApi.addComment(comment),
        onSuccess: (newComment) => {
          // 댓글 목록 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ['comments'] });

          // 새 댓글을 캐시에 설정
          queryClient.setQueryData(
            ['comments', newComment.comments.postId],
            newComment,
          );
        },
        onError: (error) => {
          console.error('댓글 생성 실패:', error);
        },
      });
    },
    useUpdateComment: (id: number) => {
      return useMutation({
        mutationFn: (comment: PostAddComment) =>
          commentsApi.updateComment(id, comment),
        onSuccess: (newComment) => {
          // 댓글 목록 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ['comments'] });

          // 새 댓글을 캐시에 설정
          queryClient.setQueryData(
            ['comments', newComment.comments.postId],
            newComment,
          );
        },
        onError: (error) => {
          console.error('댓글 생성 실패:', error);
        },
      });
    },
    useDeleteComment: (id: number) => {
      return useMutation({
        mutationFn: () => commentsApi.deleteComment(id),
        onSuccess: () => {
          console.log('deleted comment');
        },
      });
    },
  };
};
