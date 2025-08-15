import type { IUser } from '@shared/model'

export interface IComment {
  id: number
  postId: number
  body: string
  likes: number
  user: Pick<IUser, 'id' | 'username'> & { image?: string }
}
