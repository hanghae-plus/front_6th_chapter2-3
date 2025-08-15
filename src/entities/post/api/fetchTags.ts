const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const fetchTagsApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/tags`)
    return response.json()
  } catch (error) {
    console.error('태그 가져오기 오류:', error)
  }
}
