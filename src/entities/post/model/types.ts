export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

// Post 생성 타입
export interface CreatePost {
  title: string
  body: string
  userId: number
}

// Post 수정 타입
export interface UpdatePost {
  title?: string
  body?: string
  userId?: number
}

// Post 필터 타입
export interface PostFilter {
  search?: string
  tag?: string
  sortBy?: "id" | "title" | "reactions" | "none"
  sortOrder?: "asc" | "desc"
  skip?: number
  limit?: number
}

// 페이지네이션 응답 타입
export interface PostPaginatedResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
  hasMore: boolean
}
