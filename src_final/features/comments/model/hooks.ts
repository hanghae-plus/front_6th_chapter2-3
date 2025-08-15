import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Comments,
  commentsApi,
  PostAddComment,
  PutCommentsDetail,
} from '@/entities/comments';

export const useGetComment = (id: number) => {
  return useQuery({
    queryKey: ['comments'],
    queryFn: () => commentsApi.getComments(id),
  });
};
export const useComments = () => {
  const queryClient = useQueryClient();

  return {
    createComments: useMutation({
      mutationFn: (comment: PostAddComment) => commentsApi.addComment(comment),
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
    }),
    updateComment: useMutation({
      mutationFn: (comment: PutCommentsDetail) =>
        commentsApi.updateComment(comment),
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
    }),
    deleteComment: useMutation({
      mutationFn: ({ id }: { id: number; postId: number }) =>
        commentsApi.deleteComment(id),
      onSuccess: (_, { id, postId }) => {
        // ✅ 방법 2: 캐시 직접 업데이트 (더 빠름)
        queryClient.setQueryData(
          ['comments', postId],
          (oldComments: Comments[]) => {
            return oldComments.filter((comment) => comment.id !== id);
          },
        );
      },
    }),
  };
};
