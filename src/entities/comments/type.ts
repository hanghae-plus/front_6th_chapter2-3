import { PaginationInfo } from "../../shared"

export interface Comment {
  id: number
  body: string
  postId: number
  likes?: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export type Comments = PaginationInfo & { comments: Array<Comment> }
