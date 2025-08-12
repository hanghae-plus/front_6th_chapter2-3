interface Reaction {
  likes: number
  dislikes: number
}

interface Author {
  id: number
  username: string
  image: string
}

interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: Reaction
  views: number
  userId: number
  author?: Author
}

interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export type { Post, PostsResponse }
