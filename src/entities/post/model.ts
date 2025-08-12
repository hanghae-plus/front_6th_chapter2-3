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
  views?: number
  userId?: number
}

export interface AddPostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePostRequest extends AddPostRequest {
  id: number
}

export interface Tag {
  name: string
  slug: string
  url: string
}
