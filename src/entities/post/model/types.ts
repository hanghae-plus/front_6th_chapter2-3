import type { Tag } from "../../tag/model/types"
import { User } from "../../user/model/types"

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

// api 호출 관련

export interface PostsResponse {
  posts: Post[]
  total?: number
}

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePostRequest {
  title: string
  body: string
}