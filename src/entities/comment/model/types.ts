// Comment 엔티티 타입 정의
export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    id: number
    username: string
    image: string
  }
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
}
