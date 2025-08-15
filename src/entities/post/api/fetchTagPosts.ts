const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const fetchTagPostsApi = async (tag: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/tag/${tag}`)
    return await response.json()
  } catch (error) {
    console.error('태그별 게시물 가져오기 오류:', error)
  }
}
