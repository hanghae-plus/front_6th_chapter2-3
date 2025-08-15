import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment, updateComment, deleteComment, likeComment } from "./api";
import type { Comment, CommentsResponse } from "./types";
import { commentsKeys } from "../../../shared/query-keys/comments";

export function useCommentsByPostQuery(postId: number, enabled = true) {
  return useQuery<CommentsResponse>({
    queryKey: commentsKeys.byPost(postId),
    queryFn: () => getComments({ postId }),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useEnsureCommentsByPost() {
  const qc = useQueryClient();
  return useCallback(
    async (postId: number) => {
      const data = await qc.ensureQueryData<CommentsResponse>({
        queryKey: commentsKeys.byPost(postId),
        queryFn: () => getComments({ postId }),
      });
      return data;
    },
    [qc],
  );
}

export function useAddCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comment }: { comment: Partial<Comment> }) => addComment({ comment }),
    onSuccess: (_data, vars) => {
      const postId = Number(vars.comment.postId);
      if (Number.isFinite(postId)) {
        qc.invalidateQueries({ queryKey: commentsKeys.byPost(postId) });
      } else {
        qc.invalidateQueries({ queryKey: commentsKeys.all });
      }
    },
  });
}

export function useUpdateCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comment }: { comment: Comment }) => updateComment({ comment }),
    onSuccess: (data) => {
      const postId = Number((data as { postId: number }).postId);
      if (Number.isFinite(postId)) {
        qc.invalidateQueries({ queryKey: commentsKeys.byPost(postId) });
      } else {
        qc.invalidateQueries({ queryKey: commentsKeys.all });
      }
    },
  });
}

export function useDeleteCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment({ id }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: commentsKeys.byPost(vars.postId) });
    },
  });
}

export function useLikeCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number; postId: number }) => likeComment({ id, likes }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: commentsKeys.byPost(vars.postId) });
    },
  });
}
