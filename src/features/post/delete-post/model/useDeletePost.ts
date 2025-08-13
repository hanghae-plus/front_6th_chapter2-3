import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPost, IPosts } from '../../../../entities/post/model/type';
import { deletePostApi } from '../../../../entities/post/api/post-api';
import { postModel } from '../../../../entities/post/model/store';

export const useDeletePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (post: IPost) => deletePostApi(post.id),

    onSuccess: (_, post) => {
      queryClient.setQueryData<IPosts>(['posts'], (prev) => {
        if (!prev) return prev;
        return postModel.deletePost(prev, post);
      });

      onSuccess?.();
    },
    onError: (error) => {
      console.error('게시물 삭제 오류:', error);
    },
  });

  const deletePost = (post: IPost) => {
    mutation.mutate(post);
  };

  return { deletePost };
};
