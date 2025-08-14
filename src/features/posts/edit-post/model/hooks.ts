import { useState } from 'react';
import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { updatePostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { Posts } from '../../../../entities/post/model/type';

export const useEditPost = () => {
  const { posts, setPosts } = usePostsStore();
  const { closeDialog } = useDialogStore();
  const [selectedPost, setSelectedPost] = useState<Posts | null>(null);

  const updatePost = async () => {
    if (!selectedPost) return;

    try {
      const data = await updatePostAPI(selectedPost);
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
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
