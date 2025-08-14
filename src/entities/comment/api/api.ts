import { API_BASE_URL } from '../../../shared/config/api';

export async function fetchComments(postId: number) {
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
  if (!response.ok) throw new Error('댓글 조회 실패');
  return response.json();
}
