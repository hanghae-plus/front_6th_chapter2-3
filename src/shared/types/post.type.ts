import { PaginatedResponse } from "@/shared/api/type"
import { Author } from "./user.type"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views?: number
}

// 나중에 entities 폴더에 넣을 예정

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
  [key: string]: unknown
}

export interface PostWithAuthor extends Post {
  author: Author
}

// 페이지네이션 응답 타입
export interface PostPaginatedResponse extends PaginatedResponse {
  posts: Post[]
}
