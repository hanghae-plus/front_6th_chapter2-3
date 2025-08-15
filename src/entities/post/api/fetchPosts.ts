const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const fetchPostsApi = async (limit: number, skip: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`
    )

    return response.json()
  } catch (error) {
    console.error('게시물 가져오기 오류:', error)
  }
}
