import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteComment, postComment, putComment, patchLikeComment } from './index';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComment,
    onSuccess: (response, { postId, body, userId }) => {
      // 특정 게시물의 댓글 캐시에 새 댓글을 맨 아래에 추가
      queryClient.setQueriesData({ queryKey: ['comments', postId] }, (oldData: any) => {
        if (!oldData?.comments) return oldData;

        // 새로운 댓글을 맨 아래에 추가
        const newComment = {
          id: response.id || Date.now(),
          body,
          likes: 0, // 초기 좋아요 수
          postId,
          user: {
            id: userId,
            username: `User ${userId}`,
            fullName: `User ${userId}`,
          },
          ...response,
        };

        return {
          ...oldData,
          comments: [...oldData.comments, newComment], // 맨 아래에 추가
        };
      });

      console.log('댓글 추가 성공', response);
    },
    onError: (error) => {
      console.error('댓글 추가 오류:', error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putComment,
    onSuccess: (response, { id, body, postId }) => {
      // 특정 게시물의 댓글 캐시에서 해당 댓글 업데이트
      queryClient.setQueriesData({ queryKey: ['comments', postId] }, (oldData: any) => {
        if (!oldData?.comments) return oldData;

        // 수정된 댓글을 목록에서 찾아서 업데이트
        const updatedComments = oldData.comments.map((comment: any) => {
          if (comment.id === id) {
            return {
              ...comment,
              body, // 수정된 내용 반영
              ...response, // 서버에서 온 추가 필드들
            };
          }
          return comment;
        });

        return {
          ...oldData,
          comments: updatedComments,
        };
      });

      console.log('댓글 수정 성공', response);
    },
    onError: (error) => {
      console.error('댓글 수정 오류:', error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (response, { commentId, postId }) => {
      // 특정 게시물의 댓글 캐시에서 해당 댓글 제거
      queryClient.setQueriesData({ queryKey: ['comments', postId] }, (oldData: any) => {
        if (!oldData?.comments) return oldData;

        // 삭제된 댓글을 목록에서 제거
        const filteredComments = oldData.comments.filter(
          (comment: any) => comment.id !== commentId,
        );

        return {
          ...oldData,
          comments: filteredComments,
        };
      });

      console.log('댓글 삭제 성공', response);
    },
    onError: (error) => {
      console.error('댓글 삭제 오류:', error);
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchLikeComment,
    onSuccess: (response, { commentId, postId }) => {
      // 특정 게시물의 댓글 캐시에서 해당 댓글의 좋아요 수 증가
      queryClient.setQueriesData({ queryKey: ['comments', postId] }, (oldData: any) => {
        if (!oldData?.comments) return oldData;

        // 좋아요가 눌린 댓글을 찾아서 좋아요 수 증가
        const updatedComments = oldData.comments.map((comment: any) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              ...response, // 서버에서 온 추가 필드들을 먼저 적용
              likes: (comment.likes || 0) + 1, // 클라이언트에서 계산한 좋아요 수가 우선
            };
          }
          return comment;
        });

        return {
          ...oldData,
          comments: updatedComments,
        };
      });
    },
    onError: (error) => {
      console.error('댓글 좋아요 오류:', error);
    },
  });
};
