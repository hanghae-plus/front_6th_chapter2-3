const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const deletePostsApi = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  } catch (error) {
    console.error('게시물 삭제 오류:', error)
  }
}
