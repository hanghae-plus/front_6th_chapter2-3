export interface CommentItem {
  id: number
  body: string
  postId: number
  likes: number
  user: { username: string }
  isTemporary?: boolean
}
