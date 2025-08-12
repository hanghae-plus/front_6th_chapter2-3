import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IComment } from '../../../../entities/comment/model/type';
import { updateCommentApi } from '../../../../entities/comment/api/comment-api';

export const useUpdateComment = (
  comment: IComment,
  onSuccess?: (updated: IComment) => void
) => {
  const initialComment = { body: comment.body };
  const [editComment, setEditComment] =
    useState<Partial<IComment>>(initialComment);

  const mutation = useMutation({
    mutationFn: (updatedData: Partial<IComment>) =>
      updateCommentApi(updatedData),

    onSuccess: (updatedComment) => {
      onSuccess?.(updatedComment);
    },
    onError: (error) => {
      console.error('댓글 업데이트 오류:', error);
    },
  });

  const setBody = (body: string) =>
    setEditComment((prev) => ({ ...prev, body }));

  const updateComment = () => {
    mutation.mutate(editComment);
  };

  return { editComment, setBody, updateComment };
};
