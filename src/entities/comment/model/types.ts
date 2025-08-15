export type AddCommentResponse = Omit<Comment, "likes">

export interface Comment {
  body: string
  id: number
  likes: number
  postId: number
  user: {
    fullName: string
    id: number
    username: string
  }
}

export interface CommentRequest {
  body: string
  postId: null | number
  userId: number
}

export interface CommentResponse {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface DeleteCommentResponse extends Comment {
  isDeleted: boolean
}
