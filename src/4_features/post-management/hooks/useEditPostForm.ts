import { ChangeEvent, useState } from 'react';

import { usePutPostMutation } from '@/entities/post';
import { useUIStore } from '@/shared/lib';

export const useEditPostForm = () => {
  const { selectedPost } = useUIStore();
  const { mutate: updatePost } = usePutPostMutation({
    onError: error => {
      console.error('게시물 수정 오류:', error);
    },
  });

  const [title, setTitle] = useState(selectedPost?.title || '');
  const [body, setBody] = useState(selectedPost?.body || '');

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePost({
      id: selectedPost?.id ?? 0,
      title,
      body,
      userId: selectedPost?.userId ?? 0,
    });
  };

  return {
    title,
    body,
    handleChangeTitle,
    handleChangeBody,
    handleSubmit,
  };
};
