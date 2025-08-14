import { PaginatedResponse } from "@/shared/api/type"

export interface Comment {
  id: number
  body: string
  likes: number
  postId: number

  user: {
    fullName: string
    id: number
    username: string
  }
}

// Comment 생성 인터페이스
export interface CreateComment {
  body: string
  postId: number
  userId: number
}

// Comment 수정 인터페이스
export interface UpdateComment {
  body: string
}

// Comment 필터 인터페이스
export interface CommentFilter {
  postId?: number
  userId?: number
  skip?: number
  limit?: number
  orderBy?: "latest" | "top"
  [key: string]: unknown
}

export interface CommentPaginatedResponse extends PaginatedResponse {
  comments: Comment[]
}

// 댓글 반응 업데이트 인터페이스
export interface CommentReaction {
  likes: number
  dislikes: number
}
