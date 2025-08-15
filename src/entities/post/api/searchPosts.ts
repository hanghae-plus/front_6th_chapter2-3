const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const searchPostsApi = async (searchQuery: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/search?q=${searchQuery}`
    )
    return await response.json()
  } catch (error) {
    console.error('게시물 검색 오류:', error)
  }
}
