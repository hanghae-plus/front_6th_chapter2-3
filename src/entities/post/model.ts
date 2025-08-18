import type { IUser } from '@shared/model'

export interface IReactions {
  likes: number
  dislikes: number
}

export interface IPost {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: IReactions
  author?: Pick<IUser, 'id' | 'username' | 'image'>
}

export interface ITag {
  url: string
  slug: string
}
