interface CommentUser {
  id: number
  username: string
  fullName: string
}

interface Comment {
  id: number
  body: string
  postId: number | null
  likes?: number
  user: CommentUser
  userId: number | null
}

interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export type { CommentUser, Comment, CommentsResponse }
