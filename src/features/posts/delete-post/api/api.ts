export const deletePost = async (id: number) => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`게시글 삭제 실패: ${response.status} - ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    throw error;
  }
};
