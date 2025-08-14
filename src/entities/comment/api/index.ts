// Comment 엔티티 API 함수들
export const commentApi = {
  // 게시물별 댓글 조회 (단순 조회)
  getCommentsByPost: async (postId: number) => {
    const response = await fetch(`/api/comments/post/${postId}`)
    return response.json()
  },

  // 단일 댓글 조회 (단순 조회)
  getComment: async (id: number) => {
    const response = await fetch(`/api/comments/${id}`)
    return response.json()
  }
}
