import { API_BASE_URL } from '../../../../shared/config/api';

export const updateCommentAPI = async (commentId: number, updateData: { body: string }) => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) throw new Error('댓글 업데이트 실패');
  return response.json();
};
