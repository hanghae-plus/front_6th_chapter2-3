import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IAddPost, IPost } from '../../../../entities/post/model/type';
import { addPostApi } from '../../../../entities/post/api/post-api';

const initialPost: IAddPost = {
  title: '',
  body: '',
  userId: 1,
};

export const useAddPost = (onSuccess?: (createdPost: IPost) => void) => {
  const [newPost, setNewPost] = useState<IAddPost>(initialPost);

  const mutation = useMutation({
    mutationFn: (post: IAddPost) => addPostApi(post),

    onSuccess: (createdPost) => {
      onSuccess?.(createdPost);
      setNewPost(initialPost);
    },
    onError: (error) => {
      console.error('게시물 추가 오류:', error);
    },
  });

  const setTitle = (title: string) =>
    setNewPost((prev) => ({ ...prev, title }));
  const setBody = (body: string) => setNewPost((prev) => ({ ...prev, body }));
  const setUserId = (userId: number) =>
    setNewPost((prev) => ({ ...prev, userId }));

  const addPost = () => {
    mutation.mutate(newPost);
  };

  return { newPost, setTitle, setBody, setUserId, addPost };
};
