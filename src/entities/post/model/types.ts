export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

export interface PostsResponse {
  posts: Post[]
  total: number
}

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePost {
  title: string
  body: string
}
