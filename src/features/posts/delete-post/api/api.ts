/**
 * 게시글 삭제 API
 */
export const deletePost = async (id: number) => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('게시글 삭제 실패');
    }

    return true;
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    throw error;
  }
};
