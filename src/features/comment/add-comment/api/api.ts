export const addCommentAPI = async (commentData: {
  body: string;
  postId: number | null;
  userId: number;
}) => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) throw new Error('댓글 추가 실패');
  return response.json(); // 순수한 API 호출만
};
