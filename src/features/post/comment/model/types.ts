// 댓글(Comment) 타입 정의

export interface Comment {
  id: number
  postId: number
  userId: number
  body: string
  likes?: number
  // author 필드는 API에서 join해서 넘길 때만 사용 (옵션)
  author?: {
    id: number
    username: string
    image?: string
  }
  createdAt?: string
  updatedAt?: string
}
