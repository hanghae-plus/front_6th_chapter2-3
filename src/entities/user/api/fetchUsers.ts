const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const fetchUsersApi = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?limit=0&select=username,image`
    )
    return response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
