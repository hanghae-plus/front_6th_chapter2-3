import { useState, useEffect } from 'react';
import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { updatePostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { Posts } from '../../../../entities/post/model/type';
export const useEditPost = () => {
  const { selectedPost: storeSelectedPost, updatePost: updatePostInStore } = usePostsStore();
  const { closeDialog } = useDialogStore();
  const [selectedPost, setSelectedPost] = useState<Posts | null>(storeSelectedPost);

  useEffect(() => {
    setSelectedPost(storeSelectedPost);
  }, [storeSelectedPost]);

  const updatePost = async () => {
    if (!selectedPost) return;

    try {
      // 서버에 업데이트 요청
      await updatePostAPI(selectedPost);

      // 로컬 상태에 즉시 반영
      updatePostInStore(selectedPost);

      closeDialog(DIALOG_KEYS.EDIT_POST);
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
