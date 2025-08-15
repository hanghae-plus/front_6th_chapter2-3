import { httpClient } from '../../../../shared/config/httpClient';

export const updateCommentAPI = async (commentId: number, updateData: { body: string }) => {
  const response = await httpClient.patch(`/api/comments/${commentId}`, updateData, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('댓글 업데이트 실패');
  return response.json();
};
