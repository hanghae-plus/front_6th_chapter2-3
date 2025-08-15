export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    username: string
    id: number
    fullName: string
  }
}

export type CommentsByPost = {
  [postId: number]: Comment[]
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

export interface selectedCommentType {
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
