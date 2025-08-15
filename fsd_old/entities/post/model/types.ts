import { User } from "@entities/user"

export interface PostReactions {
  likes: number
  dislikes: number
}

export interface Post {
  id: number
  userId: number
  views: number
  title: string
  body: string
  reactions: PostReactions
  tags: string[]
  author?: User
}
