import { useMutation } from '@tanstack/react-query';
import { deletePostApi } from '../../../../entities/post/api/post-api';

export const useDeletePost = (onSuccess?: (deletedId: number) => void) => {
  const mutation = useMutation({
    mutationFn: (id: number) => deletePostApi(id),
    
    onSuccess: (_, id) => {
      onSuccess?.(id);
    },
    onError: (error) => {
      console.error('게시물 삭제 오류:', error);
    },
  });

  const deletePost = (id: number) => mutation.mutate(id);

  return { deletePost };
};
