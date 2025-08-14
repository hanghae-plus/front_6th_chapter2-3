import { API_BASE_URL } from '../../../shared/config/api';

// 게시글 조회
export async function fetchPosts(limit: number, skip: string) {
  const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('게시물 조회 실패');
  return response.json();
}
