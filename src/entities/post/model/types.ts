// 게시물(Post) 타입 정의

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: number
  // author 필드는 API에서 join해서 넘길 때만 사용 (옵션)
  author?: {
    id: number
    username: string
    image?: string
  }
  createdAt?: string
  updatedAt?: string
}
