export type Comment = {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    username: string
  }
}
