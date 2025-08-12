import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Comment } from '../model/types';

const API_BASE_URL = '/api/comments';

const fetchCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  const data = await response.json();
  return data.comments;
};

const addComment = async (newComment: {
  body: string;
  postId: number;
  userId: number;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

const updateComment = async ({
  commentId,
  body,
}: {
  commentId: number;
  body: string;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!response.ok) throw new Error('Failed to update comment');
  return response.json();
};

const deleteComment = async (commentId: number): Promise<{ isDeleted: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comment');
  return response.json();
};

const likeComment = async ({
  commentId,
  currentLikes,
}: {
  commentId: number;
  currentLikes: number;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  });
  if (!response.ok) throw new Error('Failed to like comment');
  return response.json();
};

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
    mutationFn: ({ commentId }: { commentId: number; postId: number }) => deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
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
