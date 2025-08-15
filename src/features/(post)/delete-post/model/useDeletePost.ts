import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/entities/post';
import { queryKeys } from '@/shared/api';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) });
      queryClient.removeQueries({ queryKey: queryKeys.comments.byPost(deletedId) });
    },
  });
}
