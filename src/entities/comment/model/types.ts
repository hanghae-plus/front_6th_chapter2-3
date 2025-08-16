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

export interface CreateComment {
  body: string
  postId: number
  userId: number
}

export interface UpdateComment {
  body: string
}

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

export interface CommentReaction {
  likes: number
  dislikes: number
}
