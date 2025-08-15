// User 엔티티 API 함수들
export const userApi = {
  // 사용자 목록 조회 (단순 조회)
  getUsers: async (limit: number = 0, select?: string) => {
    const params = new URLSearchParams()
    if (limit > 0) params.set('limit', limit.toString())
    if (select) params.set('select', select)
    
    const response = await fetch(`/api/users?${params.toString()}`)
    return response.json()
  },

  // 단일 사용자 조회 (단순 조회)
  getUser: async (id: number) => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }
}
