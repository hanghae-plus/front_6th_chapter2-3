// Tag 엔티티 API 함수들
export const tagApi = {
  // 태그 목록 조회 (단순 조회)
  getTags: async () => {
    const response = await fetch('/api/posts/tags')
    return response.json()
  }
}
