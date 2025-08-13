import { PaginatedResponse } from "../api/type"

// Comment 인터페이스
export interface Comment {
  id: number
  body: string
  likes: number
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
}

// 페이지네이션 응답 인터페이스
export interface CommentPaginatedResponse extends PaginatedResponse {
  comments: Comment[]
}

// 댓글 반응 업데이트 인터페이스
export interface CommentReaction {
  likes: number
  dislikes: number
}
