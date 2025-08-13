/**
 * 게시글 상세보기 관련 API
 */

/**
 * 특정 게시글의 댓글 가져오기
 */
export const fetchPostComments = async (postId: number) => {
  try {
    const response = await fetch(`/api/comments/post/${postId}`);

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

/**
 * 사용자 상세 정보 가져오기
 */
export const fetchUserDetail = async (userId: number) => {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error('사용자 정보 가져오기 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
};
