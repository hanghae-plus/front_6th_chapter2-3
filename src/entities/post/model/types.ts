import { PaginatedResponse } from "@/shared/api/type"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views?: number
}

// Post 생성 타입
export interface CreatePost {
  title: string
  body: string
  userId: number
  author?: Author // 사용자 정보 추가
}

// Post 수정 타입
export interface UpdatePost {
  title?: string
  body?: string
  userId?: number
}

// Post 필터 타입
export interface PostOptions {
  search?: string
  tag?: string
  sortBy?: "id" | "title" | "reactions" | "none"
  sortOrder?: "asc" | "desc"
  skip?: number
  limit?: number
}

// 간단한 User 인터페이스 (Post 목록에서 사용)
export interface Author {
  id: number
  username: string
  image: string
}

export interface PostWithAuthor extends Post {
  author?: Author
}

// 페이지네이션 응답 타입
export interface PostPaginatedResponse extends PaginatedResponse {
  posts: Post[]
}
