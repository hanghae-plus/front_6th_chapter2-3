/**
 * 게시글 추가 API
 */
export const addPostAPI = async (newPost: { title: string; body: string; userId: number }) => {
  try {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      throw new Error('게시글 추가 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('게시물 추가 오류:', error);
    throw error;
  }
};
