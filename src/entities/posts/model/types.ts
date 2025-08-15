import { Post } from "../api/types"

export interface CreatePostsRequest {
  title: string
  body: string
  userId: number
}

export interface CreatePostsResponse {
  id: number
  title: string
  body: string
  userId: number
}

export interface UpdatePostsRequest {
  id: number | null
}

export interface UpdatePostsResponse {
  id: number
  title: string
  body: string
  userId: number
  tags: Array<string>
  reactions: {
    likes: number
    dislikes: number
  }
}

export interface DeletePostsResponse extends Post {
  isDeleted: boolean
  deletedOn: string
}
