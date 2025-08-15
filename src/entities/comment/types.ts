import { User } from "@entities/user/types"

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: Pick<User, "id" | "username" | "image">
}
