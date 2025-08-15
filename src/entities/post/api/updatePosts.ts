const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const updatePostsApi = async (selectedPost: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${selectedPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPost),
    })
    return await response.json()
  } catch (error) {
    console.error('게시물 업데이트 오류:', error)
  }
}
