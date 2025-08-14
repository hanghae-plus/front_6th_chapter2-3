import { useState } from 'react';

import { useCreateCommentMutation } from '@/entities/comment';
import { useUIStore } from '@/shared/lib';

export const useAddCommentForm = () => {
  const { selectedPost, setShowAddCommentDialog } = useUIStore();
  const { mutate: createComment } = useCreateCommentMutation({
    onSuccess: () => {
      resetForm();
    },
    onError: error => {
      console.error('댓글 추가 오류:', error);
      // ! 모달 다시 열어서 사용자가 수정
      setShowAddCommentDialog(true);
    },
  });

  const [commentBody, setCommentBody] = useState<string>('');

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ! 모달 먼저 닫고 UI 낙관적 업데이트 보여주기
    setShowAddCommentDialog(false);
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
