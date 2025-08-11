import { useState } from 'react';
import { IAddPost, IPost } from '../../../../entities/post/model/type';
import { addPostApi } from '../../../../entities/post/api/post-api';

const initialPost: IAddPost = {
  title: '',
  body: '',
  userId: 1,
};

export const useAddPost = (onSuccess?: (createdPost: IPost) => void) => {
  const [newPost, setNewPost] = useState<IAddPost>(initialPost);

  const setTitle = (title: string) =>
    setNewPost((prev) => ({ ...prev, title }));
  const setBody = (body: string) => setNewPost((prev) => ({ ...prev, body }));
  const setUserId = (userId: number) =>
    setNewPost((prev) => ({ ...prev, userId }));

  const addPost = async () => {
    try {
      const createdPost = await addPostApi(newPost);

      // 게시물 추가 성공 후 처리
      // setPosts([data, ...posts]);
      // setShowAddDialog(false);
      onSuccess?.(createdPost);
      setNewPost(initialPost);
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  return { newPost, setTitle, setBody, setUserId, addPost };
};
