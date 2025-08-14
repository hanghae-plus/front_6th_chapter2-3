import { useState } from 'react';
import { useDialogStore } from '../../../../shared/store/dialog';
import { addPostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { usePostsFilter } from '../../filter-posts/model/hooks';

export const useAddPost = () => {
  const { closeDialog } = useDialogStore();
  const { applyFilters } = usePostsFilter();
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });

  const addPost = async () => {
    try {
      await addPostAPI(newPost);
      closeDialog(DIALOG_KEYS.ADD_POST);
      setNewPost({ title: '', body: '', userId: 1 });
      applyFilters(); // 필터 재적용으로 새 게시물을 author 정보와 함께 로드
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  return {
    newPost,
    setNewPost,
    addPost,
  };
};
