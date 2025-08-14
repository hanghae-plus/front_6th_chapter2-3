export interface Comment {
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

export interface CommentList {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface CreateComment {
  body: string
  id: number
  postId: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface UpdateComment {
  body: string
  id: number
  likes: number
  postId: number
  user: {
    id: number
    username: string
    fullName: string
  }
}
