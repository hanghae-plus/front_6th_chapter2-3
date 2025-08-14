export async function deletePost(postId: number): Promise<void> {
  const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
}
