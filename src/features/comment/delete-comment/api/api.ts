/**
 * 댓글 삭제 관련 API
 */

import { API_BASE_URL } from '../../../../shared/config/api';

/**
 * 댓글 삭제
 */
export const deleteCommentAPI = async (commentId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('댓글 삭제 실패');
    }

    return response;
  } catch (error) {
    console.error('댓글 삭제 API 오류:', error);
    throw error;
  }
};
