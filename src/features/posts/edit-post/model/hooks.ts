import { useState, useEffect } from 'react';
import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { updatePostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { Posts } from '../../../../entities/post/model/type';
import { usePostsFilter } from '../../filter-posts/model/hooks';

export const useEditPost = () => {
  const { selectedPost: storeSelectedPost } = usePostsStore();
  const { closeDialog } = useDialogStore();
  const { applyFilters } = usePostsFilter();
  const [selectedPost, setSelectedPost] = useState<Posts | null>(storeSelectedPost);

  useEffect(() => {
    setSelectedPost(storeSelectedPost);
  }, [storeSelectedPost]);

  const updatePost = async () => {
    if (!selectedPost) return;

    try {
      await updatePostAPI(selectedPost);
      closeDialog(DIALOG_KEYS.EDIT_POST);
      applyFilters(); // 필터 재적용으로 업데이트된 게시물을 author 정보와 함께 로드
    } catch (error) {
      console.error('게시물 업데이트 오류: ', error);
    }
  };

  return {
    selectedPost,
    setSelectedPost,
    updatePost,
  };
};
