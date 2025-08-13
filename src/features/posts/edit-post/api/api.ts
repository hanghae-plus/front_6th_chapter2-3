/**
 * 게시글 수정 API
 */
export const updatePost = async (post: { id: number; title: string; body: string }) => {
  try {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('게시글 수정 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('게시물 업데이트 오류:', error);
    throw error;
  }
};
