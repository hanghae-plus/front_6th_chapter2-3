import { User } from "@entities/user/types"

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

export interface Tag {
  name: string
  slug: string
  url: string
}
