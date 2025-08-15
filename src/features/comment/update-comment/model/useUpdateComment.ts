import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IComment, IComments } from '../../../../entities/comment/model/type';
import { commentModel } from '../../../../entities/comment/model/store';
import { updateCommentApi } from '../../../../entities/comment/api/comment-api';

export const useUpdateComment = (comment: IComment, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const initialComment = { id: comment.id, body: comment.body };
  const [editComment, setEditComment] =
    useState<Partial<IComment>>(initialComment);

  const mutation = useMutation({
    mutationFn: (comment: Partial<IComment>) => updateCommentApi(comment),

    onSuccess: (updatedComment) => {
      queryClient.setQueryData<IComments>(
        ['comments', updatedComment.postId],
        (prev) => {
          if (!prev) return prev;
          return commentModel.updateComment(prev, updatedComment);
        }
      );

      onSuccess?.();
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
