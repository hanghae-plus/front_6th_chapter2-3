export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface PostDetail extends Post {
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

export interface PostTag {
  slug: string
  name: string
  url: string
}
