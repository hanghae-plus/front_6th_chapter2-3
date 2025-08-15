import { PaginationInfo } from "../../shared"

export interface Post {
  body: string
  id: number
  reactions?: Reactions
  tags?: Array<String>
  title: string
  userId: number
  views: number
}

export interface Reactions {
  likes: number
  dislikes: number
}

export type Posts = PaginationInfo & { posts: Array<Post> }
