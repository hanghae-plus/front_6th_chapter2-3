import type { User } from "../User/User"

export interface CommentResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: User
}
