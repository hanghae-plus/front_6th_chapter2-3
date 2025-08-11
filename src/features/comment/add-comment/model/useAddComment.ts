import { useState } from 'react';
import { addCommentApi } from '../../../../entities/comment/api/comment-api';
import { IAddComment, IComment } from '../../../../entities/comment/model/type';

const initialComment: IAddComment = { body: '', postId: null, userId: 1 };

export const useAddComment = (
  onSuccess?: (createdComment: IComment) => void
) => {
  const [newComment, setNewComment] = useState<IAddComment>(initialComment);

  const setBody = (body: string) =>
    setNewComment((prev) => ({ ...prev, body }));

  const addComment = async () => {
    try {
      const createdComment = await addCommentApi(newComment);

      // 댓글 추가 성공 후 처리
      // setComments((prev) => ({
      //   ...prev,
      //   [data.postId]: [...(prev[data.postId] || []), data],
      // }));
      // setShowAddCommentDialog(false);
      onSuccess?.(createdComment);
      setNewComment(initialComment);
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  return { newComment, setBody, addComment };
};
