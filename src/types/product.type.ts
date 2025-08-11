import { User } from "./user.type"

export type Post = {
  id: number
  body: string
  title: string
  reactions: Reactions
  tags: string[]
  userId: number
  views?: number
  author?: User
}

export type Reactions = {
  dislikes?: number
  likes?: number
}

export type PostResponse = {
  limit: number
  posts: Post[]
  skip: number
  total: number
}
