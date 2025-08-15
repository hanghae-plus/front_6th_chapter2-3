const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const fetchCommentApi = async (postId: Number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`)
    return await response.json()
  } catch (error) {
    console.error('댓글 가져오기 오류:', error)
  }
}
