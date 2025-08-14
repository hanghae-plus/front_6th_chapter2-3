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

export interface CommentList {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface CreateComment {
  body: string
  postId: number
  userId: number
}

export interface UpdateComment {
  body: string
}

export interface LikeComment {
  likes: number
}
