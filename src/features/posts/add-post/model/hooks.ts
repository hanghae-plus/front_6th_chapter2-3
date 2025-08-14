import { useState } from 'react';
import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { addPostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';

export const useAddPost = () => {
  const { posts, setPosts } = usePostsStore();
  const { closeDialog } = useDialogStore();
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });

  const addPost = async () => {
    try {
      const data = await addPostAPI(newPost);
      setPosts([data, ...posts]);
      closeDialog(DIALOG_KEYS.ADD_POST);
      setNewPost({ title: '', body: '', userId: 1 });
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
