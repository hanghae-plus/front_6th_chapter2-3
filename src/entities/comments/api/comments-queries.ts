import { useQueryClient } from '@tanstack/react-query';
import { commentsApi } from './comments-api';
import { commentsKeys } from './comments-keys';
import { CreateCommentData, UpdateCommentData } from '../model/types';

export const commentsQueries = {
  // 특정 게시물의 댓글 목록 조회
  byPost: (postId: number) => ({
    queryKey: commentsKeys.byPost(postId),
    queryFn: () => commentsApi.getCommentsByPost(postId),
    enabled: postId > 0,
  }),

  // 댓글 추가
  create: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: (commentData: CreateCommentData) => {
      commentData.userId = 1;
      return commentsApi.create(commentData);
    },
    onSuccess: (newComment: any) => {
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentsKeys.byPost(newComment.postId) 
      });
    },
  }),

  // 댓글 수정
  update: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: ({ id, body }: { id: number; body: string }) =>
      commentsApi.update(id, { body } as UpdateCommentData),
    onSuccess: (updatedComment: any) => {
      // 해당 댓글의 상세 정보 업데이트
      queryClient.setQueryData(
        commentsKeys.detail(updatedComment.id),
        updatedComment
      );
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentsKeys.byPost(updatedComment.postId) 
      });
    },
  }),

  // 댓글 삭제
  delete: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: (id: number) => commentsApi.delete(id),
    onSuccess: (_: any, deletedId: number) => {
      // 해당 댓글의 상세 정보 제거
      queryClient.removeQueries({ queryKey: commentsKeys.detail(deletedId) });
      // 모든 댓글 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [...commentsKeys.all, 'post'] });
    },
  }),

  // 댓글 좋아요/취소
  like: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: ({ commentId, currentLikes }: { commentId: number, currentLikes: number }) => 
      commentsApi.like(commentId, currentLikes + 1),
    onSuccess: (updatedComment: any) => {
      // 해당 댓글의 상세 정보 업데이트
      queryClient.setQueryData(
        commentsKeys.detail(updatedComment.id),
        updatedComment
      );
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: commentsKeys.byPost(updatedComment.postId) 
      });
    },
  }),
};