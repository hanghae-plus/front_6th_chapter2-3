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
    queryKey: ['comments', id],
    queryFn: () => commentsApi.getComments(id),
  });
};
export const useComments = () => {
  const queryClient = useQueryClient();

  return {
    createComments: useMutation({
      mutationFn: (comment: PostAddComment) => commentsApi.addComment(comment),
      onSuccess: (newComment) => {
        const postId = newComment.postId;

        console.log(postId, newComment);
        queryClient.setQueryData(
          ['comments', postId],
          (oldData: { comments: Comments[] } | undefined) => {
            if (!oldData) {
              return { comments: [newComment] };
            }
            return {
              comments: [...oldData.comments, newComment],
            };
          },
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
        queryClient.invalidateQueries({
          queryKey: ['comments', newComment.postId],
        });
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
          (oldData: { comments: Comments[] } | undefined) => {
            if (!oldData) return { comments: [] };
            return {
              comments: oldData.comments.filter((comment) => comment.id !== id),
            };
          },
        );
      },
    }),
  };
};
