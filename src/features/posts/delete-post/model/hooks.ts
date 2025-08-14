import { useCallback } from 'react';
import { deletePost as deletePostAPI } from '../api/api';
import { usePostsFilter } from '../../filter-posts/model/hooks';
import { usePostsStore } from '../../../../entities/post/model/store';

export const useDeletePost = () => {
  const { applyFilters } = usePostsFilter();
  const { removePost } = usePostsStore();

  const deletePost = useCallback(
    async (id: number) => {
      try {
        removePost(id);

        await deletePostAPI(id);
      } catch (error) {
        console.error('게시물 삭제 오류:', error);
        applyFilters();
      }
    },
    [removePost, applyFilters],
  );

  return {
    deletePost,
  };
};
