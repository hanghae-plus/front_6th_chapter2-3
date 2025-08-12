import { SearchPostTypes } from '../model/type';

export async function fetchSearchPost(query: string): Promise<SearchPostTypes> {
  const response = await fetch(`/api/posts/search?q=${query}`);
  if (!response.ok) throw new Error('게시물 검색 실패');
  return response.json();
}
