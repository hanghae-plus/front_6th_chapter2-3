export interface Comment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface CommentDetail extends Comment {
  likes: number
}
