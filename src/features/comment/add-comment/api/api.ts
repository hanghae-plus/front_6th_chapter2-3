import { httpClient } from '../../../../shared/config/httpClient';

export const addCommentAPI = async (commentData: {
  body: string;
  postId: number | null;
  userId: number;
}) => {
  const response = await httpClient.post('/api/comments/add', commentData, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('댓글 추가 실패');
  return response.json(); // 순수한 API 호출만
};
