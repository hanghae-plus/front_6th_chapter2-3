/**
 * 댓글 좋아요 관련 API
 */

import { httpClient } from '../../../../shared/config/httpClient';

/**
 * 댓글 좋아요 수 증가
 */
export const likeCommentAPI = async (commentId: number, likes: number) => {
  try {
    const response = await httpClient.patch(
      `/api/comments/${commentId}`,
      { likes: likes + 1 },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!response.ok) {
      throw new Error('댓글 좋아요 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('댓글 좋아요 API 오류:', error);
    throw error;
  }
};
