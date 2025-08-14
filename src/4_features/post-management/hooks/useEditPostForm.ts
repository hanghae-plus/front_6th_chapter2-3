import { ChangeEvent, useState } from 'react';

import { usePutPostMutation } from '@/entities/post';
import { useUIStore } from '@/shared/lib';

export const useEditPostForm = () => {
  const { selectedPost, setShowEditDialog } = useUIStore();
  const { mutate: updatePost } = usePutPostMutation({
    onSuccess: () => {
      resetForm();
    },
    onError: error => {
      console.error('게시물 수정 오류:', error);
      // ! 모달 다시 열어서 사용자가 수정하기
      setShowEditDialog(true);
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

    // ! 모달 먼저 닫고 UI 낙관적 업데이트 보여주기
    setShowEditDialog(false);
    updatePost({
      id: selectedPost?.id ?? 0,
      title,
      body,
      userId: selectedPost?.userId ?? 0,
    });
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
  };

  return {
    title,
    body,
    handleChangeTitle,
    handleChangeBody,
    handleSubmit,
  };
};
