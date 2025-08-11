import { useState } from 'react';
import { IComment } from '../../../../entities/comment/model/type';
import { updateCommentApi } from '../../../../entities/comment/api/comment-api';

export const useUpdateComment = (
  comment: IComment,
  onSuccess?: (updated: IComment) => void
) => {
  const initialComment = {
    body: comment.body,
  };

  const [editComment, setEditComment] =
    useState<Partial<IComment>>(initialComment);

  const setBody = (body: string) =>
    setEditComment((prev) => ({ ...prev, body }));

  const updateComment = async () => {
    try {
      const updatedComment = await updateCommentApi(editComment);

      // 댓글 업데이트 성공 후 처리
      // setComments((prev) => ({
      //   ...prev,
      //   [data.postId]: prev[data.postId].map((comment) =>
      //     comment.id === data.id ? data : comment
      //   ),
      // }));
      // setShowEditCommentDialog(false);
      onSuccess?.(updatedComment);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  return { editComment, setBody, updateComment };
};
