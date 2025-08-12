import { useState } from 'react';
import { addCommentApi } from '../../../../entities/comment/api/comment-api';
import { IAddComment, IComment } from '../../../../entities/comment/model/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddComment = (
  postId: number,
  onSuccess?: (createdComment: IComment) => void
) => {
  const queryClient = useQueryClient();

  const initialComment: IAddComment = { body: '', postId: postId, userId: 1 };
  const [newComment, setNewComment] = useState<IAddComment>(initialComment);

  const mutation = useMutation({
    mutationFn: (comment: IAddComment) => addCommentApi(comment),

    onSuccess: (createdComment) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', createdComment.postId],
      });
      onSuccess?.(createdComment);
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
