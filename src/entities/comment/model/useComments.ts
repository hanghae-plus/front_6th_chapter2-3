import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchCommentsByPostId,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
} from '../api/commentApi';

/**
 * @description 특정 게시물의 댓글 목록을 가져오는 useQuery 훅
 * @param postId 댓글을 가져올 게시물의 ID
 */
export const useFetchComments = (postId: number | null) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId!),
    enabled: !!postId,
  });
};

/**
 * @description 새 댓글을 추가하는 useMutation 훅
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
    },
  });
};

/**
 * @description 댓글을 수정하는 useMutation 훅
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
    },
  });
};

/**
 * @description 댓글을 삭제하는 useMutation 훅
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: number }) => deleteComment(commentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
    },
  });
};

/**
 * @description 댓글에 '좋아요'를 추가하는 useMutation 훅
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
    },
  });
};
