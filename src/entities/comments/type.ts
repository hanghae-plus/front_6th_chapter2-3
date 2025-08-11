import { Pagination } from "../../shared/types"

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export type Comments = Pagination & { comments: Array<Comment> }
