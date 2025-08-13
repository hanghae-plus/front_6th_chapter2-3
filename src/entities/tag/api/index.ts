import { TagsResponse } from '../types';

export const tagAPI = {
  // 태그 목록 가져오기
  async fetchTags(): Promise<TagsResponse> {
    const response = await fetch('/api/posts/tags');
    if (!response.ok) {
      throw new Error('태그 가져오기 실패');
    }
    return response.json();
  },
};
