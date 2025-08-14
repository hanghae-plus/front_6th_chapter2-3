import { useState } from 'react';

import { useCreatePostMutation } from '@/entities/post';
import { API_CONSTANTS } from '@/shared/constants';
import { useUIStore } from '@/shared/lib';

export const useCreatePostForm = () => {
  const { setShowAddDialog } = useUIStore();
  const { mutate: createPost } = useCreatePostMutation({
    onSuccess: () => {
      resetForm();
      setShowAddDialog(false);
    },
    onError: (error: Error) => {
      console.error('게시물 추가 오류:', error);
    },
  });

  const [postTitle, setPostTitle] = useState<string>('');
  const [postBody, setPostBody] = useState<string>('');
  const [postUserId, setPostUserId] = useState<number>(
    API_CONSTANTS.DEFAULT_USER_ID
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createPost({
      title: postTitle,
      body: postBody,
      userId: postUserId,
    });
  };

  const resetForm = () => {
    setPostTitle('');
    setPostBody('');
    setPostUserId(API_CONSTANTS.DEFAULT_USER_ID);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  };

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody(e.target.value);
  };

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostUserId(Number(e.target.value));
  };

  return {
    postTitle,
    postBody,
    postUserId,
    handleSubmit,
    resetForm,
    handleChangeTitle,
    handleChangeBody,
    handleChangeUserId,
  };
};
