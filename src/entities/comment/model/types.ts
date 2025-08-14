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

export interface CommentsApiResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}
