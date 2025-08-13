import { Tag } from '../model/type';

/**
 * 태그 목록 가져오기
 */
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await fetch('/api/posts/tags');

    if (!response.ok) {
      throw new Error(`태그 가져오기 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('태그 가져오기 오류:', error);
    throw error;
  }
}
