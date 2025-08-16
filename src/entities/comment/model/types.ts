import { PaginatedResponse } from "@/shared/api/type"

interface Reactions {
  likes: number
  dislikes: number
}

interface User {
  fullName: string
  id: number
  username: string
}

export interface Comment {
  id: number
  body: string
  reactions: Reactions
  postId: number
  user: User
}

export interface CreateComment {
  body: string
  postId: number
  userId: number
}

export interface UpdateComment {
  body: string
}

export interface CommentPaginatedResponse extends PaginatedResponse {
  comments: Comment[]
}
