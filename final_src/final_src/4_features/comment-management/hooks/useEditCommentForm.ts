import { useEffect, useState } from 'react';

import { useUpdateCommentMutation } from '@/entities/comment';
import { useUIStore } from '@/shared/lib';

export const useEditCommentForm = () => {
  const { selectedComment, setSelectedComment, setShowEditCommentDialog } =
    useUIStore();
  const { mutate: updateComment } = useUpdateCommentMutation({
    onSuccess: () => {
      setSelectedComment(null);
    },
    onError: error => {
      console.error('댓글 수정 오류:', error);
      // ! 모달 다시 열어서 사용자가 수정하기
      setShowEditCommentDialog(true);
    },
  });

  const [commentBody, setCommentBody] = useState<string>(
    selectedComment?.body || ''
  );

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedComment) return;

    // ! 모달 먼저 닫고 UI 낙관적 업데이트 보여주기
    setShowEditCommentDialog(false);
    updateComment({
      ...selectedComment,
      body: commentBody,
    });
  };

  const resetForm = () => {
    setCommentBody('');
  };

  useEffect(() => {
    setCommentBody(selectedComment?.body || '');
  }, [selectedComment]);

  return {
    commentBody,
    handleChangeBody,
    handleSubmit,
    resetForm,
  };
};
