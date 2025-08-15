export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: {
    id: number
    username: string
  }
  likes: number
}

export interface Comments {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

// api 호출용 타입
export interface NewCommentDraft {
  body: string
  postId: number | null
  userId: number
}

export interface CreateCommentRequest {
  body: string
  postId: number
  userId: number
}

export interface UpdateCommentRequest {
  id: number
  body: string
}

export interface CommentsResponse {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}
