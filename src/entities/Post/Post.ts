import {User} from "../User/User.ts"

export interface PostResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: Reactions
  views: number
  userId: number
  author: User
}

export type PostId = Post["id"]

export interface Reactions {
  likes: number
  dislikes: number
}
