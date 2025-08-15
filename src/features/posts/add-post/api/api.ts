import { httpClient } from '../../../../shared/config/httpClient';

export const addPostAPI = async (newPost: { title: string; body: string; userId: number }) => {
  try {
    const response = await httpClient.post('/api/posts/add', newPost, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`게시글 추가 실패: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('게시물 추가 오류:', error);
    throw error;
  }
};
