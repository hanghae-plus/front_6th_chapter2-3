import type { Tag } from "../../tag/model/types.ts"
import { User } from "../../user/model/types.ts"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  createdAt?: string
  updatedAt?: string
  reactions: {
    likes: number
    dislikes: number
  }
  author?: User
  tagIds?: Tag["id"][]
}

export interface PostWithTags extends Post {
  tags?: Tag[]
}
