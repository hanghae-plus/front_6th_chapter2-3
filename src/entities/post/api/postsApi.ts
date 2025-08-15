import { Post, NewPost, Tag } from "../../../types"

// API 기본 URL
const API_BASE = "/api"

// 게시물 관련 API 함수들
export const postsApi = {
  // 게시물 목록 가져오기
  async getPosts(limit: number, skip: number): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`${API_BASE}/posts?limit=${limit}&skip=${skip}`)
    if (!response.ok) {
      throw new Error("게시물을 가져오는데 실패했습니다")
    }
    return response.json()
  },

  // 사용자 정보 가져오기 (username, image만)
  async getUsers(): Promise<{ users: any[] }> {
    const response = await fetch(`${API_BASE}/users?limit=0&select=username,image`)
    if (!response.ok) {
      throw new Error("사용자 정보를 가져오는데 실패했습니다")
    }
    return response.json()
  },

  // 게시물과 사용자 정보를 함께 가져오기
  async getPostsWithUsers(
    limit: number,
    skip: number,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<{ posts: Post[]; total: number }> {
    const [postsData, usersData] = await Promise.all([this.getPosts(limit, skip), this.getUsers()])

    let postsWithUsers = postsData.posts.map((post: any) => ({
      ...post,
      author: usersData.users.find((user: any) => user.id === post.userId),
    }))

    // 정렬 적용
    if (sortBy && sortBy !== "none") {
      postsWithUsers.sort((a: any, b: any) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]

        // reactions의 경우 likes 수로 정렬
        if (sortBy === "reactions") {
          aValue = a.reactions?.likes || 0
          bValue = b.reactions?.likes || 0
        }

        if (sortOrder === "desc") {
          return bValue > aValue ? 1 : -1
        } else {
          return aValue > bValue ? 1 : -1
        }
      })
    }

    return {
      posts: postsWithUsers,
      total: postsData.total,
    }
  },

  // 태그 목록 가져오기
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE}/posts/tags`)
    if (!response.ok) {
      throw new Error("태그를 가져오는데 실패했습니다")
    }
    return response.json()
  },

  // 게시물 검색
  async searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`${API_BASE}/posts/search?q=${query}`)
    if (!response.ok) {
      throw new Error("게시물 검색에 실패했습니다")
    }
    return response.json()
  },

  // 태그별 게시물 가져오기
  async getPostsByTag(tag: string, limit: number, skip: number): Promise<{ posts: Post[]; total: number }> {
    if (!tag || tag === "all") {
      return this.getPostsWithUsers(limit, skip)
    }

    const [postsResponse, usersData] = await Promise.all([fetch(`${API_BASE}/posts/tag/${tag}`), this.getUsers()])

    if (!postsResponse.ok) {
      throw new Error("태그별 게시물을 가져오는데 실패했습니다")
    }

    const postsData = await postsResponse.json()

    const postsWithUsers = postsData.posts.map((post: any) => ({
      ...post,
      author: usersData.users.find((user: any) => user.id === post.userId),
    }))

    return {
      posts: postsWithUsers,
      total: postsData.total,
    }
  },

  // 게시물 추가
  async addPost(newPost: NewPost): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
    if (!response.ok) {
      throw new Error("게시물 추가에 실패했습니다")
    }
    return response.json()
  },

  // 게시물 수정
  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
    if (!response.ok) {
      throw new Error("게시물 수정에 실패했습니다")
    }
    return response.json()
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("게시물 삭제에 실패했습니다")
    }
  },
}
