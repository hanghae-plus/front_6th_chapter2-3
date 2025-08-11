// 게시글 조회
export async function fetchPosts(limit: number, skip: string) {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('게시물 조회 실패');
  return response.json();
}
