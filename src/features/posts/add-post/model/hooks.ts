import { useState } from 'react';
import { useDialogStore } from '../../../../shared/store/dialog';
import { addPostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { usePostsStore } from '../../../../entities/post/model/store';
import { fetchUserBasic } from '../../../../entities/user/api/api';

export const useAddPost = () => {
  const { closeDialog } = useDialogStore();
  const { addPost: addPostToStore } = usePostsStore();
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });

  const addPost = async () => {
    try {
      // 서버에 게시물 추가
      const result = await addPostAPI(newPost);

      // 사용자 정보 가져오기
      const usersData = await fetchUserBasic();
      const author = usersData.users.find((user) => user.id === newPost.userId);

      // 로컬 상태에 즉시 추가 (author 정보 포함)
      const postWithAuthor = {
        ...result,
        author,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      };

      addPostToStore(postWithAuthor);
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
