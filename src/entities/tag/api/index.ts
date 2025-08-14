import { Tag } from '../types';

// PostsManagerPage.tsx에서 그대로 복사한 Tag 관련 함수들
// 태그 가져오기
export const fetchTags = async (setTags: (tags: Tag[]) => void) => {
  try {
    const response = await fetch('/api/posts/tags');
    const data = await response.json();
    setTags(data);
  } catch (error) {
    console.error('태그 가져오기 오류:', error);
  }
};
