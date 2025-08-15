// PostsManager 피처의 기능 API 함수들
export const postsManagerApi = {
  // 게시물 추가 (기능)
  addPost: async (newPost: { title: string; body: string; userId: number }) => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
    return response.json()
  },

  // 게시물 수정 (기능)
  updatePost: async (id: number, updateData: { title: string; body: string }) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
    return response.json()
  },

  // 게시물 삭제 (기능)
  deletePost: async (id: number) => {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
  },

  // 댓글 추가 (기능)
  addComment: async (newComment: { body: string; postId: number; userId: number }) => {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    })
    return response.json()
  },

  // 댓글 수정 (기능)
  updateComment: async (id: number, updateData: { body: string }) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
    return response.json()
  },

  // 댓글 삭제 (기능)
  deleteComment: async (id: number) => {
    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
  },

  // 댓글 좋아요 (기능)
  likeComment: async (id: number, likes: number) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: likes + 1 }),
    })
    return response.json()
  }
}
