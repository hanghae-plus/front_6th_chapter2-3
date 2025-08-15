/**
 * 게시글 상세보기 관련 API
 */

import { httpClient } from '../../../../shared/config/httpClient';

/**
 * 특정 게시글의 댓글 가져오기
 */
export const fetchPostComments = async (postId: number) => {
  try {
    const response = await httpClient.get(`/api/comments/post/${postId}`);

    if (!response.ok) {
      throw new Error('댓글 가져오기 실패');
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error('댓글 가져오기 오류:', error);
    throw error;
  }
};
