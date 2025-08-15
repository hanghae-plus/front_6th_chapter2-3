import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi, type Comment } from '@/entities/comment';
import type { AddCommentPayload } from '@/entities/comment/api/add-comment';
import { queryKeys } from '@/shared/api';

export type UseCommentsResult = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  add: (payload: AddCommentPayload) => Promise<void>;
  update: (id: number, patch: Partial<Comment>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  like: (id: number) => Promise<void>;
};

export function useComments(postId: number | null): UseCommentsResult {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.comments.byPost(postId!),
    queryFn: async () => {
      const data = await commentApi.getCommentsByPost(postId!);
      return data.comments;
    },
    enabled: postId !== null,
  });

  const addMutation = useMutation({
    mutationFn: (payload: AddCommentPayload) => commentApi.addComment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId!) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Comment> }) =>
      commentApi.updateComment(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId!) });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => commentApi.deleteComment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId!) });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (id: number) => {
      const current = comments.find((c) => c.id === id);
      const currentLikes = current?.likes ?? 0;
      return commentApi.likeComment(id, currentLikes);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId!) });
    },
  });

  const add = useCallback(
    async (payload: AddCommentPayload) => {
      await addMutation.mutateAsync(payload);
    },
    [addMutation],
  );

  const update = useCallback(
    async (id: number, patch: Partial<Comment>) => {
      await updateMutation.mutateAsync({ id, patch });
    },
    [updateMutation],
  );

  const remove = useCallback(
    async (id: number) => {
      await removeMutation.mutateAsync(id);
    },
    [removeMutation],
  );

  const like = useCallback(
    async (id: number) => {
      await likeMutation.mutateAsync(id);
    },
    [likeMutation, comments],
  );

  return {
    comments,
    loading: isLoading,
    error: error?.message || null,
    refetch: () => void refetch(),
    add,
    update,
    remove,
    like,
  } as const;
}
