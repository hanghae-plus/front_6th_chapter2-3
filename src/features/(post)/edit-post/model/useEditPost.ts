import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/entities/post';
import { queryKeys } from '@/shared/api';
import type { Post } from '@/entities/post';

export type EditPostPayload = {
  title?: string;
  body?: string;
};

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EditPostPayload }) =>
      postApi.updatePost(id, payload),
    onSuccess: (updatedPost: Post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.setQueryData(queryKeys.posts.detail(updatedPost.id), updatedPost);
    },
  });
}
