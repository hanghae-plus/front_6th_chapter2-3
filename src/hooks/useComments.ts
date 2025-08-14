import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCommentsByPostId,
  addComment as apiAddComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
} from "../api/comments";
import type { Comment } from "../types";

export const useComments = (postId: number | null) => {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsByPostId(postId!).then(res => res.comments),
    enabled: !!postId, // Only run query if postId is not null
  });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

  const addCommentMutation = useMutation({
    mutationFn: (newComment: { body: string; postId: number; userId: number }) => apiAddComment(newComment),
    onSuccess,
  });

  const updateCommentMutation = useMutation({
    mutationFn: (variables: { commentId: number; body: string }) =>
      apiUpdateComment(variables.commentId, variables.body),
    onSuccess,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => apiDeleteComment(commentId),
    onSuccess,
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) throw new Error("Comment not found");
        return apiLikeComment(commentId, comment.likes);
    },
    onSuccess,
  });

  return {
    comments,
    isLoading,
    error,
    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    likeComment: likeCommentMutation.mutateAsync,
  };
};
