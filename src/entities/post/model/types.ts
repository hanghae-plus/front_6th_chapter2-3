import { PaginatedResponse } from "@/shared/api/type"

interface Reactions {
  likes: number
  dislikes: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions: Reactions
  views?: number
}

// Post 생성 타입
export interface CreatePost {
  title: string
  body: string
  userId: number
  author?: Author
}

export interface UpdatePost {
  title?: string
  body?: string
  userId?: number
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
