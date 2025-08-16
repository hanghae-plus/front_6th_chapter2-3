export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

export interface UpsertComment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface DeleteComment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
  isDeleted: boolean
  deletedOn: string
}
