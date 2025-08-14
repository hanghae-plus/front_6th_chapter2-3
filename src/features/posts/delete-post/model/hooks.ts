import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost as deletePostAPI } from '../api/api';
import { usePostsFilter } from '../../posts-filter/model/hooks';
import { usePostsStore } from '../../../../entities/post/model/store';

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { applyFilters } = usePostsFilter();
  const { removePost } = usePostsStore();

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      // 서버에서 삭제
      await deletePostAPI(id);
      return id;
    },
    onMutate: async (id: number) => {
      // Optimistic Update: 서버 요청 전에 UI에서 먼저 삭제
      removePost(id);
      return { deletedId: id };
    },
    onError: (error, id, context) => {
      console.error('게시물 삭제 오류:', error);
      // 에러 발생 시 필터를 다시 적용해서 원래 상태로 복구
      applyFilters();
    },
    onSuccess: (deletedId) => {
      // React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.removeQueries({ queryKey: ['post', deletedId] });
    },
  });

  const deletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  return {
    deletePost,
    isLoading: deletePostMutation.isPending,
    isError: deletePostMutation.isError,
    error: deletePostMutation.error,
    isSuccess: deletePostMutation.isSuccess,
  };
};
