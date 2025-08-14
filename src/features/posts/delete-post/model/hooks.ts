import { useCallback } from 'react';
import { deletePost as deletePostAPI } from '../api/api';
import { usePostsFilter } from '../../filter-posts/model/hooks';

export const useDeletePost = () => {
  const { applyFilters } = usePostsFilter();

  const deletePost = useCallback(
    async (id: number) => {
      try {
        await deletePostAPI(id);
        applyFilters();
      } catch (error) {
        console.error('게시물 삭제 오류:', error);
      }
    },
    [applyFilters],
  );

  return {
    deletePost,
  };
};
