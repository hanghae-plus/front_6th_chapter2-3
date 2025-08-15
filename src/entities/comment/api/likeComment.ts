const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const likeCommentApi = async (id: Number, likes: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        likes: likes + 1,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 좋아요 오류:', error)
  }
}
