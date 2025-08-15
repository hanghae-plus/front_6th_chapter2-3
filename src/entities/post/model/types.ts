export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  userId: number
  author: {
    id: number
    username: string
    image: string
  }
}

export interface SelectedPost {}
