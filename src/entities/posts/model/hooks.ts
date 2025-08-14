import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import postsApi from '../api';
import { Post } from './types.ts';

export const usePosts = () => {
  const queryClient = useQueryClient();

  return {
    // Query
    useGetPosts: (limit: number, skip: number) =>
      useQuery({
        queryKey: ['posts', limit, skip],
        queryFn: () => postsApi.getPosts({ limit, skip }),
      }),

    // Mutations
    useCreatePost: () =>
      useMutation({
        mutationFn: postsApi.createPost,
        onSuccess: (newPost) => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.setQueryData(['posts', newPost.id], newPost);
        },
      }),

    useUpdatePost: () =>
      useMutation({
        mutationFn: ({ id, data }: { id: number; data: Post }) =>
          postsApi.updatePost(id, data),
        onSuccess: (updatedPost) => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
        },
      }),

    useDeletePost: () =>
      useMutation({
        mutationFn: (id: number) => postsApi.deletePost(id),
        onSuccess: (_, deletedId) => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.removeQueries({ queryKey: ['posts', deletedId] });
        },
      }),
  };
};
