import { User } from '../model/types'
const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const openUsersApi = async (user: User) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${user.id}`)
    return await response.json()
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error)
  }
}
