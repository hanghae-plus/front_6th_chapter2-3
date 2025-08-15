const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const deleteCommentApi = async (id: Number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
    })
    return await response.json()
  } catch (error) {
    console.error('댓글 삭제 오류:', error)
  }
}
