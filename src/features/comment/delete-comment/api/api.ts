/**
 * 댓글 삭제 관련 API
 */

import { httpClient } from '../../../../shared/config/httpClient';

/**
 * 댓글 삭제
 */
export const deleteCommentAPI = async (commentId: number) => {
  try {
    const response = await httpClient.delete(`/api/comments/${commentId}`);

    if (!response.ok) {
      throw new Error('댓글 삭제 실패');
    }

    return response;
  } catch (error) {
    console.error('댓글 삭제 API 오류:', error);
    throw error;
  }
};
