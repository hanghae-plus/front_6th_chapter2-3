import { User } from "../../user/model/types"

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user?: User // user 정보 추가
}

export interface CreateCommentData {
  body: string
  postId: number
  userId: number
}

export interface UpdateCommentData {
  body?: string
  likes?: number
}