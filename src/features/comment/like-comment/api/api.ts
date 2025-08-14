/**
 * 댓글 좋아요 관련 API
 */

import { API_BASE_URL } from '../../../../shared/config/api';

/**
 * 댓글 좋아요 수 증가
 */
export const likeCommentAPI = async (commentId: number, likes: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: likes + 1 }),
    });

    if (!response.ok) {
      throw new Error('댓글 좋아요 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('댓글 좋아요 API 오류:', error);
    throw error;
  }
};
