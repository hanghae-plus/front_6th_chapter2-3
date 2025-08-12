export interface PostAuthor {
  id: number
  username: string
  image?: string
}

export interface PostReactions {
  likes: number
  dislikes: number
}

export interface PostItem {
  id: number
  title: string
  tags?: string[]
  author?: PostAuthor
  reactions?: Partial<PostReactions>
}
