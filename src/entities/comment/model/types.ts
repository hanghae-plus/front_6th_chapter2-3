export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
}

export interface CreateCommentRequest {
  body: string
  postId: number
  userId: number
}

export interface UpdateComment {
  body: string
}
