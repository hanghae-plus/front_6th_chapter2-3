import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IAddComment,
  IComments,
} from '../../../../entities/comment/model/type';
import { commentModel } from '../../../../entities/comment/model/store';
import { addCommentApi } from '../../../../entities/comment/api/comment-api';

export const useAddComment = (postId: number, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const initialComment: IAddComment = { body: '', postId: postId, userId: 1 };
  const [newComment, setNewComment] = useState<IAddComment>(initialComment);

  const mutation = useMutation({
    mutationFn: (comment: IAddComment) => addCommentApi(comment),

    onSuccess: (createdComment) => {
      const newComment = commentModel.addResponseToComment(createdComment);

      queryClient.setQueryData<IComments>(['comments', postId], (prev) => {
        if (!prev) {
          return {
            comments: [newComment],
            total: '1',
            skip: 0,
            limit: 10,
          };
        }

        return commentModel.addComment(prev, newComment);
      });

      onSuccess?.();
      setNewComment(initialComment);
    },
    onError: (error) => {
      console.error('댓글 추가 오류:', error);
    },
  });

  const setBody = (body: string) =>
    setNewComment((prev) => ({ ...prev, body }));

  const addComment = () => {
    mutation.mutate(newComment);
  };

  return { newComment, setBody, addComment };
};
