import { Tag } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 모든 태그 목록 조회
export const fetchTags = async (setTags: (tags: Tag[]) => void) => {
  try {
    const response = await httpClient.get('/api/posts/tags');
    const data = await response.json();
    setTags(data);
  } catch (error) {
    console.error('태그 가져오기 오류:', error);
  }
};
