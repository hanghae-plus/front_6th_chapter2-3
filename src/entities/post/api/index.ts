// Post 엔티티 API 함수들
export const postApi = {
  // 게시물 목록 조회 (단순 조회)
  getPosts: async (limit: number, skip: number) => {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    return response.json()
  },

  // 게시물 검색 (단순 조회)
  searchPosts: async (query: string) => {
    const response = await fetch(`/api/posts/search?q=${query}`)
    return response.json()
  },

  // 태그별 게시물 조회 (단순 조회)
  getPostsByTag: async (tag: string) => {
    const response = await fetch(`/api/posts/tag/${tag}`)
    return response.json()
  },

  // 단일 게시물 조회 (단순 조회)
  getPost: async (id: number) => {
    const response = await fetch(`/api/posts/${id}`)
    return response.json()
  }
}
