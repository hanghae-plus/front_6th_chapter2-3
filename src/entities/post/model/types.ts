// 게시물 타입
export interface Post {
  body: string
  id: number
  reactions: {
    dislikes: number
    likes: number
  }
  tags: string[]
  title: string
  userId: number
  views: number
}

export interface CreatePost {
  id: number
  title: string
  body: string
  userId: number
}

export interface UpdatePost {
  body: string
  id: number
  reactions: {
    dislikes: number
    likes: number
  }
  tags: string[]
  title: string
  userId: number
}
