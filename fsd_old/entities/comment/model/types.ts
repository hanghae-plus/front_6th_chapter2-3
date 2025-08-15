import { User } from "@entities/user"

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: Pick<User, "id" | "username" | "image">
}
