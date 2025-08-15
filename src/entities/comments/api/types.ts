export interface Comments {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface CommentsPostData {
  comments: Array<Comments>
  total: number
  skip: number
  limit: number
}
