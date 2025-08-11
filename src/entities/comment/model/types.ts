// 댓글 도메인 타입 정의

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

// 생성용 타입
export interface NewComment {
  body: string
  postId: number | null
  userId: number
}
