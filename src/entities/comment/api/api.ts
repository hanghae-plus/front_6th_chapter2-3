export async function fetchComments(postId: number) {
  const response = await fetch(`/api/comments/post/${postId}`);
  if (!response.ok) throw new Error('댓글 조회 실패');
  return response.json();
}

export async function createComment(comment: { body: string; postId: number; userId: number }) {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!response.ok) throw new Error('댓글 추가 실패');
  return response.json();
}
