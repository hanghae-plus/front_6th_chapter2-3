export async function deleteComment(commentId: number): Promise<void> {
  const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
}
