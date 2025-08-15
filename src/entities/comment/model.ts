import type { User } from "../user/model"
// TODO : 질문하기, 이렇게 다른 Entity의 타입을 가져다 써도 되나..?

export interface Comment {
  id: number
  body: string
  likes: number
  postId: number
  user: Pick<User, "id" | "username" | "fullName">
}

export interface CommentRequest {
  postId: number
  body: string
  userId: number
}
