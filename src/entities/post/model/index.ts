export interface Reactions {
  likes?: number
  dislikes?: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: Reactions
  isTemporary?: boolean
}

export interface Tag {
  url: string
  slug: string
}
