import type { UserSummary } from "../../user/model/types"

export interface Post {
  // 클라이언트 고유 식별자(서버 중복 ID 문제 방지용)
  clientId?: string
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  author?: UserSummary
}

export interface PostsApiResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}
