// 게시물 타입
export interface Post {
  posts: PostItem[]
  total: number
  limit: number
  skip: number
}

export interface PostItem {
  id: number
  reactions: {
    dislikes: number
    likes: number
  }
  title: string
  body: string
  userId: number
  views: number
  tags: string[]
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

/**
 * 태그 타입
 */
export interface Tag {
  name: string
  slug: string
  url: string
}
