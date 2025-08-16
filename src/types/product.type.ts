import { User } from "./user.type"

export type Post = {
  id: number
  body: string
  title: string
  reactions: Reactions
  tags: string[]
  userId: number
  views?: number
  author?: User
}

export type Reactions = {
  dislikes?: number
  likes?: number
}

export type PostResponse = {
  limit: number
  posts: Post[]
  skip: number
  total: number
}

export type Tag = {
  url: string
  slug: string
}

export type PostDraft = {
  title: string
  body: string
  userId: number
}

export type SearchInfo = {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string
}
