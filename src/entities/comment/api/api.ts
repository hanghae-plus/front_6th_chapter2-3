import { httpClient } from '../../../shared/config/httpClient';

export async function fetchComments(postId: number) {
  const response = await httpClient.get(`/api/comments/post/${postId}`);
  if (!response.ok) throw new Error('댓글 조회 실패');
  return response.json();
}
