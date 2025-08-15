import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/entities/post';
import { queryKeys } from '@/shared/api';
import type { Post } from '@/entities/post';

export type AddPostPayload = {
  title: string;
  body: string;
  userId: number;
};

export function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddPostPayload) => postApi.addPost(payload),
    onSuccess: (newPost: Post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.setQueryData(queryKeys.posts.detail(newPost.id), newPost);
    },
  });
}
