import { Pagination } from "../../shared/types"

export interface Post {
  body: string
  id: number
  reactions: Reactions
  tags: Array<String>
  title: string
  userId: number
  views: number
}

export interface Reactions {
  likes: number
  dislikes: number
}

export type Posts = Pagination & { posts: Array<Post> }
