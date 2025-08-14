import { useState } from 'react';

import { useCreateCommentMutation } from '@/entities/comment';
import { useUIStore } from '@/shared/lib';

export const useAddCommentForm = () => {
  const { selectedPost, setShowAddCommentDialog } = useUIStore();
  const { mutate: createComment } = useCreateCommentMutation({
    onSuccess: () => {
      setShowAddCommentDialog(false);
      resetForm();
    },
    onError: error => {
      console.error('댓글 추가 오류:', error);
    },
  });

  const [commentBody, setCommentBody] = useState<string>('');

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment({
      body: commentBody,
      postId: selectedPost?.id ?? 0,
      userId: 1,
    });
  };

  const resetForm = () => {
    setCommentBody('');
  };

  return {
    commentBody,
    handleChangeBody,
    handleSubmit,
    resetForm,
  };
};
