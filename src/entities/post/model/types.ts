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
  tags?: string[]
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